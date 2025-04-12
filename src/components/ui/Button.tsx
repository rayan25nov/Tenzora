import React from "react";
import { WalletMinimal } from "lucide-react";

interface ButtonProps {
  children: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center px-5 py-2 space-x-2 rounded-sm bg-[#AD1AAF] text-white hover:bg-[#9C19A3] transition-colors duration-200"
      type="button"
    >
      <WalletMinimal className="w-5 h-5" />
      <span>{children}</span>
    </button>
  );
};

export default Button;
