import { NFTCard } from "@/components/NFTCard";
import Button from "@/components/ui/Button";
import Simpson from "@/assets/images/simpson.jpg";
import LivingOfArt from "@/assets/images/woman-7858063_1280.jpg";
import Warrior from "@/assets/images/warrior.jpeg";
import MilkyWay from "@/assets/images/milky_way.svg";
import WalletSupport from "@/components/WalletSupport";
import HowItWorks from "@/components/HowItWorks";
import CollectionCarousel from "@/components/OurCollection";
import { ImageUpscale, Binoculars } from "lucide-react";
const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-black text-white overflow-hidden py-20">
      <div className="container mx-auto px-6 lg:px-20 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2">
          <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
            EXPLORE, CREATE AND
            <br />
            SELL YOUR NFT'S ON
            <br />
            TENZORA
          </h1>
          <p className="mt-4 text-sm text-gray-300">
            Tenzora Is The World's First And Largest NFT/Avatar Marketplace On
            Cardano
          </p>
          <div className="mt-8 flex space-x-4">
            <Button
              onClick={() => console.log("Explore More clicked")}
              text="Explore More"
              icon={<Binoculars />}
            />

            <Button
              onClick={() => console.log("create clicked")}
              text="Create"
              icon={<ImageUpscale />}
            />
          </div>
        </div>

        <div className="lg:w-1/2 relative mt-12 lg:mt-0 flex justify-center">
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
      {/* Milky Way Background Image */}
      <img
        src={MilkyWay}
        alt="Milky Way"
        className="w-full pointer-events-none select-none"
      />
      {/* Wallet we support section */}
      <WalletSupport />

      {/* How it works */}
      <HowItWorks />

      {/* Our Collection */}
      <CollectionCarousel />
    </section>
  );
};

export default HeroSection;
