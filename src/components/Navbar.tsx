import Button from "./ui/Button";
import { Avatar, AvatarImage } from "./ui/Avatar";
import Logo_T from "../assets/images/logo_T2.png";
import UserProfile from "../assets/images/user_profile.png";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between bg-[#140C1F] px-6 py-4 text-white h-25">
      {/* Logo */}
      <div className="flex items-center">
        <img src={Logo_T} alt="Tenzora Logo" className="w-10 h-10" />
        <span className="text-4xl font-bold mt-2">ENZORA</span>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-x-8 text-lg bg-[#2b2236] p-4">
        <a href="#" className="hover:text-gray-400">
          EXPLORE
        </a>
        <a href="#" className="hover:text-gray-400">
          TRENDING NFTs
        </a>
        <a href="#" className="hover:text-gray-400">
          AUCTIONED NFTs
        </a>
        <a href="#" className="hover:text-gray-400">
          INFLUENCERS
        </a>
      </div>

      {/* Wallet Button & Profile */}
      <div className="flex items-center gap-x-6">
        <Button onClick={() => console.log("Wallet connected")}>
          Connect Wallet
        </Button>
        <Avatar>
          <AvatarImage src={UserProfile} alt="User Avatar" />
        </Avatar>
      </div>
    </nav>
  );
};

export default Navbar;
