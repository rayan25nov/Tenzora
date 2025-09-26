import Button from "./ui/Button";
import { Avatar, AvatarImage } from "@/components/ui/Avatar";
import Logo_T from "@/assets/images/logo_T2.png";
import UserProfile from "@/assets/images/user_profile.png";
import { useDispatch } from "react-redux";
import { BrowserWallet } from "@meshsdk/core";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { disconnectWallet, setWallet } from "@/redux/walletSlice";
import Popup from "./Popup";
import { Link } from "react-router-dom";
import { WalletMinimal, Menu, X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

type Wallet = {
  icon: string;
  id: string;
  name: string;
  version: string;
};

const Navbar = () => {
  const dispatch = useDispatch();
  const walletAddress = useSelector(
    (state: RootState) => state.wallet.walletAddress
  );

  const location = useLocation();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const connectWallet = async () => {
    const availableWallets = await BrowserWallet.getAvailableWallets();
    if (availableWallets.length === 0) {
      toast.error(
        "No wallets found. Please install a Cardano wallet extension.",
        { closeButton: true }
      );
      return;
    }
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

  const disconnect = async () => {
    dispatch(disconnectWallet());
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="flex items-center justify-between bg-[#140C1F] px-6 py-4 text-white h-25 relative">
        {/* Logo */}
        <div className="flex items-center">
          <img src={Logo_T} alt="Tenzora Logo" className="w-10 h-10" />
          <span className="text-2xl md:text-4xl font-bold mt-2">ENZORA</span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-x-8 text-lg bg-[#2b2236] p-4">
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
            to="/market-place"
            className={`${
              isActive("/market-place")
                ? "text-[#AD1AAF] font-semibold"
                : "text-gray-200"
            } hover:text-[#9C19A3] transition`}
          >
            MARKET PLACE
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

        {/* Desktop Wallet Button & Profile */}
        <div className="hidden md:flex items-center gap-x-6">
          {!walletAddress ? (
            <Button
              onClick={connectWallet}
              text="Connect Wallet"
              icon={<WalletMinimal />}
            />
          ) : (
            <div className="flex items-center space-x-4">
              <span className="text-gray-800 font-medium bg-gray-100 px-3 py-1 rounded-lg text-sm">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
              <button
                onClick={disconnect}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Disconnect
              </button>
            </div>
          )}

          <Avatar>
            <AvatarImage src={UserProfile} alt="User Avatar" />
          </Avatar>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 hover:bg-[#2b2236] rounded-md transition-colors"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#140C1F] border-t border-[#2b2236] lg:hidden z-50">
            <div className="px-6 py-4 space-y-4">
              {/* Mobile Navigation Links */}
              <div className="flex flex-col items-center space-y-4">
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className={`${
                    isActive("/")
                      ? "text-[#AD1AAF] font-semibold"
                      : "text-gray-200"
                  } hover:text-[#9C19A3] transition text-lg py-2`}
                >
                  EXPLORE
                </Link>
                <Link
                  to="/our-collection"
                  onClick={closeMobileMenu}
                  className={`${
                    isActive("/our-collection")
                      ? "text-[#AD1AAF] font-semibold"
                      : "text-gray-200"
                  } hover:text-[#9C19A3] transition text-lg py-2`}
                >
                  OUR COLLECTION
                </Link>
                <Link
                  to="/market-place"
                  onClick={closeMobileMenu}
                  className={`${
                    isActive("/market-place")
                      ? "text-[#AD1AAF] font-semibold"
                      : "text-gray-200"
                  } hover:text-[#9C19A3] transition text-lg py-2`}
                >
                  MARKET PLACE
                </Link>
                <Link
                  to="/create-nft"
                  onClick={closeMobileMenu}
                  className={`${
                    isActive("/create-nft")
                      ? "text-[#AD1AAF] font-semibold"
                      : "text-gray-200"
                  } hover:text-[#9C19A3] transition text-lg py-2`}
                >
                  CREATE NFTs
                </Link>
              </div>

              {/* Mobile Wallet Section */}
              <div className="border-t border-[#2b2236] pt-4 space-y-4 flex flex-col items-center">
                {!walletAddress ? (
                  <Button
                    onClick={() => {
                      connectWallet();
                      closeMobileMenu();
                    }}
                    text="Connect Wallet"
                    icon={<WalletMinimal />}
                  />
                ) : (
                  <div className="space-y-3">
                    <div className="text-gray-800 font-medium bg-gray-100 px-3 py-2 rounded-lg text-sm inline-block">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </div>
                    <button
                      onClick={() => {
                        disconnect();
                        closeMobileMenu();
                      }}
                      className="block text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                )}

                {/* Mobile Profile */}
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={UserProfile} alt="User Avatar" />
                  </Avatar>
                  <span className="text-gray-300">Profile</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Popup for Wallet Selection */}
      {popupOpen && (
        <Popup
          wallets={wallets}
          onSelectWallet={selectWallet}
          onClose={() => setPopupOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
