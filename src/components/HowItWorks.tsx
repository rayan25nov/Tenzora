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
  <div className="mt-20 w-full py-24 flex flex-col items-center justify-center">
    <h2 className="text-white text-5xl mb-12">How it works</h2>
    <div className="flex flex-row items-end justify-between w-full max-w-4xl relative">
      {walletSteps.map((step, idx) => (
        <React.Fragment key={idx}>
          <div className="relative flex flex-col items-center">
            <Step {...step} />
            {/* Dotted line (horizontal) except after last step */}
            {idx < walletSteps.length - 1 && (
              <div
                className="
                  absolute right-[-100px] top-8
                  w-[130px] border-t-3 border-dashed border-[#fff] opacity-50
                  z-0
                "
              />
            )}
          </div>
        </React.Fragment>
      ))}
    </div>
  </div>
);

export default HowItWorks;
