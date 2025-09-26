import React from "react";
import NftCarousel from "@/components/NftCorousel";

const CollectionCarousel: React.FC = () => (
  <div className="mt-8 sm:mt-12 md:mt-16 lg:mt-20 flex flex-col items-center px-4 sm:px-6 lg:px-8">
    <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-[#fff] to-[#F81DFB] text-sm sm:text-base md:text-lg lg:text-xl mt-2 sm:mt-4 mb-6 sm:mb-8 md:mb-12 font-semibold text-center max-w-xs sm:max-w-md md:max-w-lg lg:max-w-none">
      Trade With World&apos;s Most Trusted And Fastest Wallets
    </h2>
    <h1 className="text-white text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl mb-8 sm:mb-12 md:mb-16 lg:mb-20 text-center">
      Our Collection
    </h1>
    <NftCarousel />
  </div>
);

export default CollectionCarousel;
