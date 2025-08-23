import React from "react";

interface WalletCardProps {
  name: string;
  logo: string;
}

const WalletCard: React.FC<WalletCardProps> = ({ name, logo }) => (
  <div className="flex flex-col items-center justify-center bg-[#251D34] rounded-2xl w-[220px] h-[280px] m-2 shadow-lg">
    <div className="flex items-center justify-center w-[150px] h-[150px] bg-[#32274B] mb-8 rounded-full p4">
      <img src={logo} alt="wallet" className="rounded-full w-20" />
    </div>
    <span className="text-white text-lg font-medium">{name}</span>
  </div>
);

export default WalletCard;
