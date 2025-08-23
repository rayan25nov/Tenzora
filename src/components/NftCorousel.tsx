import React, { useState } from "react";
import { Enchantress, Hela, Anime, Ape, Cat, Loki, Freyja } from "@/assets";

const NFTs = [Enchantress, Hela, Anime, Ape, Cat, Loki, Freyja];

const CARD_WIDTH = 250;
const CARD_HEIGHT = 380;

const CollectionCarousel: React.FC = () => {
  const [center, setCenter] = useState(3); // Center index

  // Carousel navigation handlers
  const prev = () => setCenter((center - 1 + NFTs.length) % NFTs.length);
  const next = () => setCenter((center + 1) % NFTs.length);

  // Calculate the visual order for circular display
  const getVisualCards = () => {
    const totalCards = NFTs.length;
    const visibleCards = [];

    // Arrange cards around the center
    for (let i = 0; i < totalCards; i++) {
      const actualIndex =
        (center + i - Math.floor(totalCards / 2) + totalCards) % totalCards;
      visibleCards.push({
        src: NFTs[actualIndex],
        actualIndex,
        visualPosition: i - Math.floor(totalCards / 2), // -3, -2, -1, 0, 1, 2, 3
      });
    }

    return visibleCards;
  };

  return (
    <div className="flex flex-col items-center py-8 max-w-7xl mx-auto">
      <div className="relative flex items-center w-full justify-center">
        {/* Left arrow */}
        <button
          onClick={prev}
          className="absolute left-0 z-30 bg-white/60 hover:bg-white/90 backdrop-blur-md rounded-full p-2 text-2xl font-bold shadow-lg"
          style={{ top: "50%", transform: "translateY(-50%)" }}
        >
          {"‹"}
        </button>

        {/* Cards */}
        <div
          className="flex items-end justify-center w-full"
          style={{ gap: "-60px" }}
        >
          {getVisualCards().map((card, idx) => {
            const { src, actualIndex, visualPosition } = card;
            const absPosition = Math.abs(visualPosition);

            // Progressive scaling based on distance from center
            let scale = 1,
              opacity = 1,
              z = 10,
              border = "";

            if (visualPosition === 0) {
              // Center card
              scale = 1.18;
              z = 30;
              border = "border-2 border-[#F81DFB]";
              opacity = 1;
            } else if (absPosition === 1) {
              scale = 0.99;
              z = 20;
              opacity = 0.95;
            } else if (absPosition === 2) {
              scale = 0.85;
              opacity = 0.8;
              z = 15;
            } else if (absPosition === 3) {
              scale = 0.7;
              opacity = 0.6;
              z = 10;
            } else {
              // Cards that are very far
              scale = 0.55;
              opacity = 0.4;
              z = 5;
            }

            return (
              <div
                key={`${actualIndex}-${visualPosition}`}
                className={`
                  rounded-2xl overflow-hidden transition-all duration-500 shadow-2xl bg-white
                  ${border}
                `}
                style={{
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                  marginLeft: idx !== 0 ? -60 : 0,
                  transform: `scale(${scale})`,
                  opacity,
                  zIndex: z,
                  borderRadius: 18,
                  position: "relative",
                  transition: "all 0.5s cubic-bezier(.47,1.64,.41,.8)",
                  cursor: "pointer",
                }}
                onClick={() => setCenter(actualIndex)}
              >
                <img
                  src={src}
                  alt={`NFT ${actualIndex + 1}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                  loading="lazy"
                />
              </div>
            );
          })}
        </div>

        {/* Right arrow */}
        <button
          onClick={next}
          className="absolute right-0 z-30 bg-white/60 hover:bg-white/90 backdrop-blur-md rounded-full p-2 text-2xl font-bold shadow-lg"
          style={{ top: "50%", transform: "translateY(-50%)" }}
        >
          {"›"}
        </button>
      </div>
    </div>
  );
};

export default CollectionCarousel;
