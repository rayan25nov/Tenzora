// frontend/src/utils/cardano.ts
import type { FormData } from "@/pages/create-nft";
import { BrowserWallet } from "@meshsdk/core";
import {
  Blockfrost,
  Lucid,
  Data,
  Script,
  Constr,
  UTxO,
  TxHash,
  Network,
  WalletApi,
  fromText,
} from "lucid-cardano";
import axios from "axios";

export interface NetworkConfig {
  projectId: string;
  baseUrl: string;
  lucidNetwork: Network;
}

// 1. MeshBrowserWallet is what enable() returns
type MeshBrowserWallet = Awaited<ReturnType<typeof BrowserWallet.enable>>;
// 2. The CIP‑30 API you actually call against
type MeshWalletApi = MeshBrowserWallet["walletInstance"];

class Cardano {
  private lucidInstance!: Lucid;
  private config!: NetworkConfig;

  private static NETWORKS: Record<number, NetworkConfig> = {
    1: {
      baseUrl: import.meta.env.VITE_BLOCKFROST_MAINNET_URL,
      projectId: import.meta.env.VITE_BLOCKFROST_MAINNET_PROJECT_ID,
      lucidNetwork: "Mainnet",
    },
    0: {
      baseUrl: import.meta.env.VITE_BLOCKFROST_URL,
      projectId: import.meta.env.VITE_BLOCKFROST_PROJECT_ID,
      lucidNetwork: "Preprod",
    },
  };

  /**
   * Initialize Lucid based on the wallet's network ID.
   * @param networkId 0 for Testnet, 1 for Mainnet
   */
  public async init(networkId: number): Promise<void> {
    const cfg = Cardano.NETWORKS[networkId];
    if (!cfg) {
      throw new Error(
        `Unsupported network ID ${networkId}. Expected 0 (Testnet) or 1 (Mainnet).`
      );
    }
    this.config = cfg;

    if (!this.lucidInstance) {
      const { projectId, baseUrl, lucidNetwork } = this.config;
      if (!projectId) {
        throw new Error(
          "Missing Blockfrost project ID in environment for network ID " +
            networkId
        );
      }

      this.lucidInstance = await Lucid.new(
        new Blockfrost(baseUrl, projectId),
        lucidNetwork
      );
    }
  }

  /** Ensures Lucid is initialized */
  public getLucid(): Lucid {
    if (!this.lucidInstance) {
      throw new Error("Lucid not initialized: call init(networkId) first.");
    }
    return this.lucidInstance;
  }

  public meshToLucidAdapter(meshApi: MeshWalletApi): WalletApi {
    return {
      getNetworkId: () => meshApi.getNetworkId(),
      getUtxos: () => meshApi.getUtxos(),
      getBalance: () => meshApi.getBalance(),
      getUsedAddresses: () => meshApi.getUsedAddresses(),
      getUnusedAddresses: () => meshApi.getUnusedAddresses(),
      getChangeAddress: () => meshApi.getChangeAddress(),
      getRewardAddresses: () => meshApi.getRewardAddresses(),

      // normalize Mesh’s optional-return into a concrete array
      getCollateral: () => meshApi.getCollateral().then((u) => u ?? []),

      signTx: (tx, partial) => meshApi.signTx(tx, partial),
      submitTx: (tx) => meshApi.submitTx(tx),

      // Lucid calls (address, payload)
      // Mesh expects (payload, address)
      // and returns { signature, key, … }
      signData: async (address, payload) => {
        const ds = await meshApi.signData(payload, address);
        return { signature: ds.signature, key: ds.key };
      },

      // Mesh only has getCollateral under experimental
      experimental: {
        getCollateral: () =>
          meshApi.experimental.getCollateral().then((u) => u ?? []),
        // stub out event methods so Lucid’s types are satisfied
        on: (_event, _cb) => {
          /* no-op */
        },
        off: (_event, _cb) => {
          /* no-op */
        },
      },
    };
  }

  private getMarketplaceScript = (): Script => {
    return {
      type: "PlutusV2",
      script: import.meta.env.VITE_MARKETPLACE_SCRIPT!,
    };
  };

  public getMarketplaceAddress = (): string => {
    return this.lucidInstance.utils.validatorToAddress(
      this.getMarketplaceScript()
    );
  };

  private getMintingPolicy = (): Script => {
    return {
      type: "PlutusV2",
      script: import.meta.env.VITE_MINTING_POLICY!,
    };
  };

  public getMintingPolicyId = (): string => {
    return this.lucidInstance.utils.mintingPolicyToId(this.getMintingPolicy());
  };

  private getKeyHash = (address: string): { pkh: string; skh: string } => {
    const details = this.lucidInstance.utils.getAddressDetails(address);
    const pkh = details.paymentCredential?.hash;
    const skh = details.stakeCredential?.hash;
    if (!pkh || !skh) throw new Error("Cannot extract payment key hash");
    return { pkh, skh };
  };

  public mintNft = async (wallet: BrowserWallet, formData: FormData) => {
    try {
      const walletApi = this.meshToLucidAdapter(wallet.walletInstance);
      // initialize lucid if not initialized
      if (!this.lucidInstance) {
        const networkId = await walletApi.getNetworkId();
        await this.init(networkId);
      }
      const lucid = this.getLucid();
      lucid.selectWallet(walletApi);

      const mintingPolicy: Script = this.getMintingPolicy();
      const policyId = this.getMintingPolicyId();
      // add some time Stamp string such that even when name is same it still generate nft not ft
      const unit = policyId + fromText(formData.itemName);
      console.log("Asset Unit:", unit);
      // Upload File to Ipfs using Blockfrost
      if (!formData.uploadedFile) {
        throw new Error("No file uploaded");
      }
      const data = new FormData();
      data.append("file", formData.uploadedFile);
      const url = `${import.meta.env.VITE_IPFS_URL}/ipfs/add`;
      const ipfs_key: string = import.meta.env.VITE_IPFS_KEY!;

      const { data: res } = await axios.post(url, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          project_id: ipfs_key,
        },
      });

      const ipfs_hash = res.ipfs_hash;
      console.log("IPFS Hash:- ", ipfs_hash);

      const metadata = {
        [policyId]: {
          [formData.itemName]: {
            name: formData.itemName,
            description: formData.description,
            image: `ipfs://${ipfs_hash}`,
            external_url: formData.externalLink,
            collection: formData.collection,
            supply: formData.supply,
          },
        },
      };

      // const metadata = {
      //   [policyId]: {
      //     [tokenName]: {
      //       name: "PLASTIC CREDIT",
      //       image: "ipfs://QmP6mKWsUExK1emB7K9bxSRjdRLaqoysdutTsfYg6PDGUy",
      //       description: "This Token was minted for Plastik",
      //       mediaType: "image/png",
      //     },
      //   },
      // };

      console.log("MetaData:- ", metadata);

      const redeemer = Data.to(new Constr(0, [1n]));
      console.log("Redeemer:- ", redeemer);

      const tx = await lucid
        .newTx()
        .mintAssets({ [unit]: 1n }, redeemer)
        .attachMintingPolicy(mintingPolicy)
        .attachMetadata(721, metadata)
        .payToAddress(await lucid.wallet.address(), {
          [unit]: 1n,
        })
        .addSigner(await lucid.wallet.address())
        .complete();

      console.log("TX:- ", tx);
      const signedTx = await tx.sign().complete();
      console.log("Signed Transaction:", signedTx);

      const txHash = await signedTx.submit();
      console.log("NFT Minted & Locked in Contract! TxHash:", txHash);
      return txHash;
    } catch (error) {
      console.error("Mint NFT error:", error);
    }
  };

  public listNft = async (
    wallet: BrowserWallet,
    policyId: string,
    assetName: string,
    priceInAda: number,
    adminFeePercent: number = 500 // 5% in basis points
  ): Promise<TxHash> => {
    try {
      const walletApi = this.meshToLucidAdapter(wallet.walletInstance);
      // initialize lucid if not initialized
      if (!this.lucidInstance) {
        const networkId = await walletApi.getNetworkId();
        await this.init(networkId);
      }
      const lucid = this.getLucid();
      lucid.selectWallet(walletApi);
      const sellerAddress = await this.lucidInstance.wallet.address();
      const { pkh: sellerPKH, skh: sellerSKH } = this.getKeyHash(sellerAddress);

      // Get admin PKH (you can change this to your admin address)
      const adminPKH = sellerPKH; // Using seller as admin for demo
      const adminSKH = sellerSKH;

      const unit = policyId + assetName;
      const priceInLovelace = BigInt(priceInAda * 1_000_000);

      const datumToLock = new Constr(0, [
        sellerPKH,
        sellerSKH,
        priceInLovelace,
        policyId,
        assetName,
        BigInt(adminFeePercent),
        adminPKH,
        adminSKH,
      ]);

      // List redeemer - Constr with index 0 (List action)
      //   const redeemer = Data.to(new Constr(0, []));

      const tx = await this.lucidInstance
        .newTx()
        .payToContract(
          this.getMarketplaceAddress(),
          { inline: Data.to(datumToLock) },
          { [unit]: 1n }
        )
        .addSigner(sellerAddress)
        .complete();

      const signedTx = await tx.sign().complete();
      const txHash = await signedTx.submit();

      console.log(`NFT listed successfully! TxHash: ${txHash}`);
      return txHash;
    } catch (error) {
      console.error("List NFT error:", error);
      throw error;
    }
  };

  public buyNft = async (
    wallet: BrowserWallet,
    marketplaceUtxo: UTxO,
    buyerAddress?: string
  ): Promise<TxHash> => {
    try {
      const walletApi = this.meshToLucidAdapter(wallet.walletInstance);
      // initialize lucid if not initialized
      if (!this.lucidInstance) {
        const networkId = await walletApi.getNetworkId();
        await this.init(networkId);
      }
      const lucid = this.getLucid();
      lucid.selectWallet(walletApi);
      if (!marketplaceUtxo.datum) throw new Error("No datum found in UTXO");

      const decodedDatum = Data.from(marketplaceUtxo.datum) as Constr<Data>;
      const buyer = buyerAddress || (await this.lucidInstance.wallet.address());

      console.log("Buyer Address:- ", buyer);
      const utxos = await this.lucidInstance.wallet.getUtxos();
      console.log("buyer utxos", utxos);

      // Calculate payments
      const price = Number(decodedDatum.fields[2] as bigint);
      console.log("working upto here!", price);
      const adminFee = Math.floor(
        (price * Number(decodedDatum.fields[5] as bigint)) / 10000
      );
      console.log("working upto here!!", adminFee);

      const sellerAmount = price - adminFee;
      console.log("working upto here!!!", sellerAmount);

      const unit =
        (decodedDatum.fields[3] as string) + (decodedDatum.fields[4] as string);
      console.log("working upto here!!!!", unit);

      // Extract seller and admin addresses
      const sellerAddress = this.lucidInstance.utils.credentialToAddress(
        this.lucidInstance.utils.keyHashToCredential(
          decodedDatum.fields[0] as string
        ),
        this.lucidInstance.utils.keyHashToCredential(
          decodedDatum.fields[1] as string
        )
      );
      console.log("Seller Address:- ", sellerAddress);

      const adminAddress = this.lucidInstance.utils.credentialToAddress(
        this.lucidInstance.utils.keyHashToCredential(
          decodedDatum.fields[6] as string
        ),
        this.lucidInstance.utils.keyHashToCredential(
          decodedDatum.fields[7] as string
        )
      );
      console.log("Admin Address:- ", adminAddress);

      // Buy redeemer - Constr with index 1 (Buy action)
      const redeemer = Data.to(new Constr(1, []));

      const tx = await this.lucidInstance
        .newTx()
        .collectFrom([marketplaceUtxo], redeemer)
        .attachSpendingValidator(this.getMarketplaceScript())
        .payToAddress(buyer, { [unit]: 1n }) // NFT to buyer
        .payToAddress(sellerAddress, { lovelace: BigInt(sellerAmount) }) // Payment to seller
        .payToAddress(adminAddress, { lovelace: BigInt(adminFee) }) // Admin fee
        .complete();

      const signedTx = await tx.sign().complete();
      const txHash = await signedTx.submit();

      console.log(`NFT purchased successfully! TxHash: ${txHash}`);
      return txHash;
    } catch (error) {
      console.error("Buy NFT error:", error);
      throw error;
    }
  };

  public cancelListing = async (
    wallet: BrowserWallet,
    marketplaceUtxo: UTxO
  ): Promise<TxHash> => {
    try {
      const walletApi = this.meshToLucidAdapter(wallet.walletInstance);
      // initialize lucid if not initialized
      if (!this.lucidInstance) {
        const networkId = await walletApi.getNetworkId();
        await this.init(networkId);
      }
      const lucid = this.getLucid();
      lucid.selectWallet(walletApi);
      if (!marketplaceUtxo.datum) throw new Error("No datum found in UTXO");

      const decodedDatum = Data.from(marketplaceUtxo.datum) as Constr<Data>;
      const sellerAddress = this.lucidInstance.utils.credentialToAddress(
        this.lucidInstance.utils.keyHashToCredential(
          decodedDatum.fields[0] as string
        ),
        this.lucidInstance.utils.keyHashToCredential(
          decodedDatum.fields[1] as string
        )
      );

      const unit = ((decodedDatum.fields[3] as string) +
        decodedDatum.fields[4]) as string;

      // Cancel redeemer - Constr with index 2 (Cancel action)
      const redeemer = Data.to(new Constr(2, []));

      const tx = await this.lucidInstance
        .newTx()
        .collectFrom([marketplaceUtxo], redeemer)
        .attachSpendingValidator(this.getMarketplaceScript())
        .payToAddress(sellerAddress, { [unit]: 1n }) // Return NFT to seller
        .addSigner(sellerAddress)
        .complete();

      const signedTx = await tx.sign().complete();
      const txHash = await signedTx.submit();

      console.log(`Listing cancelled successfully! TxHash: ${txHash}`);
      return txHash;
    } catch (error) {
      console.error("Cancel listing error:", error);
      throw error;
    }
  };

  public updateListing = async (
    wallet: BrowserWallet,
    marketplaceUtxo: UTxO,
    newPriceInAda: number
  ): Promise<TxHash> => {
    try {
      const walletApi = this.meshToLucidAdapter(wallet.walletInstance);
      // initialize lucid if not initialized
      if (!this.lucidInstance) {
        const networkId = await walletApi.getNetworkId();
        await this.init(networkId);
      }
      const lucid = this.getLucid();
      lucid.selectWallet(walletApi);
      if (!marketplaceUtxo.datum) throw new Error("No datum found in UTXO");

      const decodedDatum = Data.from(marketplaceUtxo.datum) as Constr<Data>;

      const newPriceInLovelace = BigInt(newPriceInAda * 1_000_000);

      // Create updated datum with new price
      const newDatum = new Constr(0, [
        decodedDatum.fields[0], // seller
        decodedDatum.fields[1], // seller
        newPriceInLovelace, // updated price
        decodedDatum.fields[3], // policy_id
        decodedDatum.fields[4], // asset_name
        decodedDatum.fields[5], // admin_fee_percent
        decodedDatum.fields[6], // admin pkh
        decodedDatum.fields[7], // admin skh
      ]);

      const unit = ((decodedDatum.fields[3] as string) +
        decodedDatum.fields[4]) as string;

      // Update redeemer - Constr with index 3 (Update action)
      const redeemer = Data.to(new Constr(3, []));

      const tx = await this.lucidInstance
        .newTx()
        .collectFrom([marketplaceUtxo], redeemer)
        .attachSpendingValidator(this.getMarketplaceScript())
        .payToContract(
          this.getMarketplaceAddress(),
          { inline: Data.to(newDatum) },
          { [unit]: 1n }
        )
        .addSigner(await this.lucidInstance.wallet.address())
        .complete();

      const signedTx = await tx.sign().complete();
      const txHash = await signedTx.submit();

      console.log(`Listing updated successfully! TxHash: ${txHash}`);
      return txHash;
    } catch (error) {
      console.error("Update listing error:", error);
      throw error;
    }
  };

  public getMarketplaceListings = async (): Promise<UTxO[]> => {
    try {
      const utxos = await this.lucidInstance.utxosAt(
        this.getMarketplaceAddress()
      );
      return utxos;
    } catch (error) {
      console.error("Query listings error:", error);
      throw error;
    }
  };

  public generateUniqueAssetSuffix() {
    const timestamp = Date.now();
    const last8digits = parseInt(timestamp.toString().slice(-8));
    return fromText(last8digits.toString());
  }
}

// create a singleton instance
const cardanoInstance = new Cardano();
export default cardanoInstance;
