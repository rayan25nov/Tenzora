import React from "react";
import { NFTCard } from "@/components/NFTCard";
import Simpson from "@/assets/images/simpson.jpg";
import LivingOfArt from "@/assets/images/woman-7858063_1280.jpg";
import Warrior from "@/assets/images/warrior.jpeg";

const NFTShowcase: React.FC = () => {
  return (
    <div className="w-full lg:w-1/2 mt-12 lg:mt-0">
      {/* Mobile/Small Screen Layout - Vertical Stack */}
      <div className="flex flex-col items-center space-y-6 lg:hidden">
        <NFTCard
          title="Living Of The Art"
          price="100"
          imageUrl={LivingOfArt}
          className="w-full max-w-xs border-2 border-[#F81DFB] shadow-lg"
        />
        <NFTCard
          title="Simpson"
          price="150"
          imageUrl={Simpson}
          className="w-full max-w-xs"
        />
        <NFTCard
          title="Strong Warrior"
          price="200"
          imageUrl={Warrior}
          className="w-full max-w-xs"
        />
      </div>

      {/* Large Screen Layout - Overlapping Cards */}
      <div className="hidden lg:flex relative justify-center">
        {/* Left card */}
        <NFTCard
          title="Simpson"
          price="150"
          imageUrl={Simpson}
          className="z-10 translate-x-1/3"
        />
        {/* Middle card - bring up and on top */}
        <NFTCard
          title="Living Of The Art"
          price="100"
          imageUrl={LivingOfArt}
          className="absolute z-20 -top-10"
        />
        {/* Right card */}
        <NFTCard
          title="Strong Warrior"
          price="200"
          imageUrl={Warrior}
          className="relative z-10 -translate-x-1/4 top-10"
        />
      </div>
    </div>
  );
};

export default NFTShowcase;
