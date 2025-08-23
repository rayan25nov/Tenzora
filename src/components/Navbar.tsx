import Button from "./ui/Button";
import { Avatar, AvatarImage } from "@/components/ui/Avatar";
import Logo_T from "@/assets/images/logo_T2.png";
import UserProfile from "@/assets/images/user_profile.png";
import { useDispatch } from "react-redux";
// import { RootState } from "../redux/store";
import { BrowserWallet } from "@meshsdk/core";
import {} from "@meshsdk/contract";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { setWallet } from "@/redux/walletSlice";
import Popup from "./Popup";
import { Link } from "react-router-dom";
import { WalletMinimal } from "lucide-react";

type Wallet = {
  icon: string;
  id: string;
  name: string;
  version: string;
};

const Navbar = () => {
  const dispatch = useDispatch();
  // const walletAddress = useSelector(
  //   (state: RootState) => state.wallet.walletAddress
  // );

  // const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [popupOpen, setPopupOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const connectWallet = async () => {
    // console.log("Connecting wallet...");
    const availableWallets = await BrowserWallet.getAvailableWallets();
    // console.log(availableWallets);
    setWallets(availableWallets);
    setPopupOpen(true);
  };

  const selectWallet = async (walletId: string) => {
    console.log("Selected wallet:", walletId);
    try {
      const wallet = await BrowserWallet.enable(walletId);
      const address = (await wallet.getChangeAddress()) || "N/A";
      dispatch(setWallet({ walletId, address }));
      setPopupOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        toast.error("Please Activate Connect as DApp Account in your wallet");
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  return (
    <nav className="flex items-center justify-between bg-[#140C1F] px-6 py-4 text-white h-25">
      {/* Logo */}
      <div className="flex items-center">
        <img src={Logo_T} alt="Tenzora Logo" className="w-10 h-10" />
        <span className="text-4xl font-bold mt-2">ENZORA</span>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-x-8 text-lg bg-[#2b2236] p-4">
        <Link
          to="/"
          className={`${
            isActive("/") ? "text-[#AD1AAF] font-semibold" : "text-gray-200"
          } hover:text-[#9C19A3] transition`}
        >
          EXPLORE
        </Link>
        <Link
          to="/our-collection"
          className={`${
            isActive("/our-collection")
              ? "text-[#AD1AAF] font-semibold"
              : "text-gray-200"
          } hover:text-[#9C19A3] transition`}
        >
          OUR COLLECTION
        </Link>
        <Link
          to="/trending"
          className={`${
            isActive("/trending")
              ? "text-[#AD1AAF] font-semibold"
              : "text-gray-200"
          } hover:text-[#9C19A3] transition`}
        >
          TRENDING NFTs
        </Link>
        <Link
          to="/create-nft"
          className={`${
            isActive("/create-nft")
              ? "text-[#AD1AAF] font-semibold"
              : "text-gray-200"
          } hover:text-[#9C19A3] transition`}
        >
          CREATE NFTs
        </Link>
      </div>

      {/* Wallet Button & Profile */}
      <div className="flex items-center gap-x-6">
        <Button
          onClick={connectWallet}
          text="Connect Wallet"
          icon={<WalletMinimal />}
        />

        <Avatar>
          <AvatarImage src={UserProfile} alt="User Avatar" />
        </Avatar>
      </div>

      {/* Popup for Wallet Selection */}
      {popupOpen && (
        <Popup
          wallets={wallets}
          onSelectWallet={selectWallet}
          onClose={() => setPopupOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
