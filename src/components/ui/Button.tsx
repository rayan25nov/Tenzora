import React from "react";

interface ButtonProps {
  text: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, icon }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center px-4 py-2 space-x-4 rounded-sm bg-[#AD1AAF] text-white hover:bg-[#9C19A3] transition-colors duration-200"
      type="button"
    >
      {/* render icon here */}
      {icon && <span className="w-5 h-5">{icon}</span>}
      <span>{text}</span>
    </button>
  );
};

export default Button;
