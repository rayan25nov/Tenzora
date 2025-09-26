import Button from "@/components/ui/Button";
import { MilkyWay } from "@/assets";
import WalletSupport from "@/components/WalletSupport";
import HowItWorks from "@/components/HowItWorks";
import CollectionCarousel from "@/components/OurCollection";
import { ImageUpscale, Binoculars } from "lucide-react";
import NFTShowcase from "@/components/NFTShowcase";
import { useNavigate } from "react-router-dom";
import { useCallback, useRef } from "react";
const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  // 1. Create a ref on the element at the bottom of the page
  const bottomRef = useRef<HTMLDivElement>(null);

  // 2. Extract a scroll handler
  const scrollToBottom = useCallback(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
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
              onClick={scrollToBottom}
              text="Explore More"
              icon={<Binoculars />}
            />

            <Button
              onClick={() => navigate("/create-nft")}
              text="Create"
              icon={<ImageUpscale />}
            />
          </div>
        </div>
        <NFTShowcase />
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

      <div ref={bottomRef} className="h-1" />
      {/* Our Collection */}
      <CollectionCarousel />
    </section>
  );
};

export default HeroSection;
