import React from "react";

// The height and width must match your image for pixel precision

const ConnectWalletButton: React.FC<{
  onClick?: () => void;
  children?: React.ReactNode;
}> = ({ onClick, children = "Connect Wallet" }) => (
  <button
    onClick={onClick}
    className={`
      relative
      flex items-center justify-center
      h-[43px] w-[189px]
      bg-[#be19b9]
      text-white text-base font-normal
      select-none
      px-6
      border-none
      outline-none
      overflow-hidden
      uppercase
      tracking-wide
    `}
    style={{
      fontFamily: "inherit",
    }}
  >
    {/* Decor: left modular edge */}
    <span
      className="
        absolute left-0 top-1/2 -translate-y-1/2
        h-4 w-2
        bg-white
        "
      style={{
        borderTop: "5px solid #be19b9",
        borderBottom: "5px solid #be19b9",
        borderLeft: "4px solid #fff",
        borderRight: "2px solid #be19b9",
        zIndex: 2,
      }}
    />
    {/* Decor: right modular edge */}
    <span
      className="
        absolute right-0 top-1/2 -translate-y-1/2
        h-4 w-2
        bg-white
        "
      style={{
        borderTop: "5px solid #be19b9",
        borderBottom: "5px solid #be19b9",
        borderRight: "4px solid #fff",
        borderLeft: "2px solid #be19b9",
        zIndex: 2,
      }}
    />

    {/* Button text */}
    <span className="z-10">{children}</span>
  </button>
);

export default ConnectWalletButton;
