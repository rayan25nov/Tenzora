import React from "react";
import {
  FaYoutube,
  FaTwitter,
  FaFacebookF,
  FaGooglePlusG,
} from "react-icons/fa";

import Logo from "../assets/images/logo_T2.png";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#140C1F] text-white px-10 py-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
        {/* Logo & Description */}
        <div className="w-full md:w-1/2 lg:w-1/4 flex items-center mb-2">
          <img src={Logo} alt="Tenzora Logo" className="w-10 h-10 mb-3" />
          <span className="text-3xl font-bold tracking-wide">ENZORA</span>
        </div>

        {/* About Section */}
        <div className="w-full md:w-1/2 lg:w-1/3 flex flex-col mr-10 mb-2">
          <p className="text-gray-400 leading-relaxed">
            Tenzora is the world's leading NFTs marketplace where you can
            discover, sell, and bid NFTs on Cardano.
          </p>
          <div className="flex space-x-10 mt-6 text-purple-400 text-2xl">
            <FaYoutube className="hover:text-white cursor-pointer transition duration-300" />
            <FaTwitter className="hover:text-white cursor-pointer transition duration-300" />
            <FaFacebookF className="hover:text-white cursor-pointer transition duration-300" />
            <FaGooglePlusG className="hover:text-white cursor-pointer transition duration-300" />
          </div>
        </div>

        {/* About Links */}
        <div className="w-full md:w-1/2 lg:w-1/6 flex flex-col mb-2">
          <h3 className="text-white font-bold text-lg mb-4">About</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-white cursor-pointer transition duration-300">
              About NFT
            </li>
            <li className="hover:text-white cursor-pointer transition duration-300">
              NFT Blog
            </li>
            <li className="hover:text-white cursor-pointer transition duration-300">
              Activity
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div className="w-full md:w-1/2 lg:w-1/6 flex flex-col mb-2">
          <h3 className="text-white font-bold text-lg mb-4">Support</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-white cursor-pointer transition duration-300">
              Help & Support
            </li>
            <li className="hover:text-white cursor-pointer transition duration-300">
              Item Details
            </li>
            <li className="hover:text-white cursor-pointer transition duration-300">
              Collection
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-5 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Tenzora. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
