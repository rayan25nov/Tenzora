import React, { useState, useEffect, useRef } from "react";
import { Enchantress, Hela, Anime, Ape, Cat, Loki, Freyja } from "@/assets";

const NFTs = [Enchantress, Hela, Anime, Ape, Cat, Loki, Freyja];

interface CarouselDimensions {
  cardWidth: number;
  cardHeight: number;
  gap: number;
  visibleCards: number;
}

const CollectionCarousel: React.FC = () => {
  const [center, setCenter] = useState(3);
  const [dimensions, setDimensions] = useState<CarouselDimensions>({
    cardWidth: 250,
    cardHeight: 380,
    gap: -60,
    visibleCards: 7,
  });
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Responsive dimensions based on screen size
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;

      if (width < 640) {
        // Mobile
        setDimensions({
          cardWidth: 160,
          cardHeight: 240,
          gap: -40,
          visibleCards: 3,
        });
      } else if (width < 768) {
        // Small tablet
        setDimensions({
          cardWidth: 180,
          cardHeight: 270,
          gap: -45,
          visibleCards: 5,
        });
      } else if (width < 1024) {
        // Tablet
        setDimensions({
          cardWidth: 200,
          cardHeight: 300,
          gap: -50,
          visibleCards: 5,
        });
      } else if (width < 1280) {
        // Desktop
        setDimensions({
          cardWidth: 220,
          cardHeight: 330,
          gap: -55,
          visibleCards: 6,
        });
      } else {
        // Large desktop
        setDimensions({
          cardWidth: 250,
          cardHeight: 380,
          gap: -60,
          visibleCards: 7,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) next();
    if (isRightSwipe) prev();
  };

  // Navigation handlers
  const prev = () => setCenter((center - 1 + NFTs.length) % NFTs.length);
  const next = () => setCenter((center + 1) % NFTs.length);

  // Get visible cards based on screen size
  const getVisualCards = () => {
    const totalCards = Math.min(NFTs.length, dimensions.visibleCards);
    const visibleCards = [];
    const centerOffset = Math.floor(totalCards / 2);

    for (let i = 0; i < totalCards; i++) {
      const actualIndex =
        (center + i - centerOffset + NFTs.length) % NFTs.length;
      visibleCards.push({
        src: NFTs[actualIndex],
        actualIndex,
        visualPosition: i - centerOffset,
      });
    }

    return visibleCards;
  };

  return (
    <div className="flex flex-col items-center py-4 sm:py-6 md:py-8 max-w-7xl mx-auto w-full">
      <div className="relative flex items-center w-full justify-center px-4 sm:px-8 md:px-12">
        {/* Left arrow - hidden on mobile, visible on tablet+ */}
        <button
          onClick={prev}
          className="absolute left-2 sm:left-4 md:left-0 z-30 bg-white/60 hover:bg-white/90 backdrop-blur-md rounded-full p-1 sm:p-2 text-lg sm:text-xl md:text-2xl font-bold shadow-lg transition-all duration-200 hidden sm:block"
          style={{ top: "50%", transform: "translateY(-50%)" }}
          aria-label="Previous NFT"
        >
          {"‹"}
        </button>

        {/* Cards container with touch support */}
        <div
          ref={carouselRef}
          className="flex items-end justify-center w-full overflow-hidden"
          style={{ gap: `${dimensions.gap}px` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {getVisualCards().map((card, idx) => {
            const { src, actualIndex, visualPosition } = card;
            const absPosition = Math.abs(visualPosition);

            // Responsive scaling
            let scale = 1,
              opacity = 1,
              z = 10,
              border = "";

            if (visualPosition === 0) {
              // Center card
              scale =
                window.innerWidth < 640
                  ? 1.1
                  : window.innerWidth < 1024
                  ? 1.15
                  : 1.18;
              z = 30;
              border = "border-2 border-[#F81DFB]";
              opacity = 1;
            } else if (absPosition === 1) {
              scale = window.innerWidth < 640 ? 0.95 : 0.99;
              z = 20;
              opacity = 0.95;
            } else if (absPosition === 2) {
              scale = window.innerWidth < 640 ? 0.8 : 0.85;
              opacity = window.innerWidth < 640 ? 0.7 : 0.8;
              z = 15;
            } else if (absPosition === 3) {
              scale = window.innerWidth < 640 ? 0.6 : 0.7;
              opacity = window.innerWidth < 640 ? 0.5 : 0.6;
              z = 10;
            } else {
              scale = 0.55;
              opacity = 0.4;
              z = 5;
            }

            return (
              <div
                key={`${actualIndex}-${visualPosition}`}
                className={`
                  rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-500 shadow-lg sm:shadow-xl md:shadow-2xl bg-white cursor-pointer
                  ${border}
                `}
                style={{
                  width: dimensions.cardWidth,
                  height: dimensions.cardHeight,
                  marginLeft: idx !== 0 ? dimensions.gap : 0,
                  transform: `scale(${scale})`,
                  opacity,
                  zIndex: z,
                  borderRadius: window.innerWidth < 640 ? 12 : 18,
                  position: "relative",
                  transition: "all 0.5s cubic-bezier(.47,1.64,.41,.8)",
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

        {/* Right arrow - hidden on mobile, visible on tablet+ */}
        <button
          onClick={next}
          className="absolute right-2 sm:right-4 md:right-0 z-30 bg-white/60 hover:bg-white/90 backdrop-blur-md rounded-full p-1 sm:p-2 text-lg sm:text-xl md:text-2xl font-bold shadow-lg transition-all duration-200 hidden sm:block"
          style={{ top: "50%", transform: "translateY(-50%)" }}
          aria-label="Next NFT"
        >
          {"›"}
        </button>
      </div>

      {/* Mobile navigation dots */}
      <div className="flex justify-center mt-4 space-x-2 sm:hidden">
        {NFTs.map((_, index) => (
          <button
            key={index}
            onClick={() => setCenter(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === center ? "bg-[#F81DFB] scale-125" : "bg-white/40"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Mobile swipe instruction */}
      <p className="text-white/60 text-xs mt-2 sm:hidden text-center">
        Swipe to navigate
      </p>
    </div>
  );
};

export default CollectionCarousel;
