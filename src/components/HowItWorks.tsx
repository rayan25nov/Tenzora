import React from "react";
import Step from "./Step";
import { WalletIcon, CollectionIcon, NftIcon, SaleIcon } from "@/assets";

const walletSteps = [
  {
    icon: WalletIcon,
    label: "Set Up Your Wallet",
  },
  {
    icon: CollectionIcon,
    label: "Create Your Collection",
  },
  {
    icon: NftIcon,
    label: "Add Your NFTs",
  },
  {
    icon: SaleIcon,
    label: "List Them For Sale",
  },
];

const HowItWorks: React.FC = () => (
  <div className="mt-8 sm:mt-12 md:mt-16 lg:mt-20 w-full py-12 sm:py-16 md:py-20 lg:py-24 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
    {/* Responsive heading */}
    <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-8 sm:mb-10 md:mb-12 text-center font-bold">
      How it works
    </h2>

    {/* Desktop and tablet layout (horizontal) */}
    <div className="hidden md:flex flex-row items-end justify-between w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-6xl relative">
      {walletSteps.map((step, idx) => (
        <React.Fragment key={idx}>
          <div className="relative flex flex-col items-center flex-1">
            <Step {...step} />
            {/* Horizontal dotted line for desktop/tablet */}
            {idx < walletSteps.length - 1 && (
              <div className="absolute left-full top-6 sm:top-8 md:top-10 lg:top-12 w-8 sm:w-12 md:w-16 lg:w-20 xl:w-24 border-t-2 sm:border-t-3 border-dashed border-white opacity-50 z-0" />
            )}
          </div>
        </React.Fragment>
      ))}
    </div>

    {/* Mobile layout (vertical) */}
    <div className="md:hidden flex flex-col items-center space-y-8 sm:space-y-10 w-full max-w-xs sm:max-w-sm">
      {walletSteps.map((step, idx) => (
        <React.Fragment key={idx}>
          <div className="relative flex flex-col items-center w-full">
            <Step {...step} />
            {/* Vertical dotted line for mobile */}
            {idx < walletSteps.length - 1 && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 h-6 sm:h-8 border-l-2 border-dashed border-white opacity-50 z-0 mt-2" />
            )}
          </div>
        </React.Fragment>
      ))}
    </div>

    {/* Step counter for mobile (optional enhancement) */}
    <div className="md:hidden mt-8 flex justify-center space-x-2">
      {walletSteps.map((_, index) => (
        <div key={index} className="w-2 h-2 rounded-full bg-white opacity-30" />
      ))}
    </div>
  </div>
);

export default HowItWorks;
