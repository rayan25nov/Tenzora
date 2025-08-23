import React from "react";

import NftCarousel from "./NftCorousel";

const CollectionCarousel: React.FC = () => (
  <div className="mt-20 flex flex-col items-center">
    <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-[#fff] to-[#F81DFB] text-xl mt-4 mb-12 font-semibold">
      Trade With World&apos;s Most Trusted And Fastest Wallets
    </h2>
    <h1 className="text-white text-7xl mb-20">Our Collection</h1>
    <NftCarousel />
  </div>
);

export default CollectionCarousel;
