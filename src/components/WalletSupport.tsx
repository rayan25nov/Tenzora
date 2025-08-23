import React from "react";
import WalletCard from "./WalletCard";
// import your real logo components instead of these placeholders
import { Lace, Eternl, Nami, GeroWallet, Typhon } from "@/assets";

const wallets = [
  { name: "Eternl", logo: Eternl },
  { name: "Lace", logo: Lace },
  { name: "Nami", logo: Nami },
  { name: "Gero Wallet", logo: GeroWallet },
  { name: "Typhon", logo: Typhon },
];

const WalletSupport: React.FC = () => (
  <div className="mt-20 flex flex-col items-center">
    <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-[#fff] to-[#F81DFB] text-xl mt-4 mb-12 font-semibold">
      Trade With World&apos;s Most Trusted And Fastest Wallets
    </h2>
    <h1 className="text-white text-7xl mb-20">Wallets We Support</h1>
    <div className="flex flex-row justify-center flex-wrap gap-5">
      {wallets.map((wallet) => (
        <WalletCard key={wallet.name} name={wallet.name} logo={wallet.logo} />
      ))}
    </div>
  </div>
);

export default WalletSupport;
