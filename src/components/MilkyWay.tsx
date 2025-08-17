import React from "react";

interface Star {
  top: string; // percentage, e.g. "20%"
  left: string; // percentage
  size?: number; // px, optional
  opacity?: number; // optional
}

// Example positions; add or edit based on your design
const stars: Star[] = [
  { top: "30%", left: "10%", size: 3, opacity: 0.7 },
  { top: "50%", left: "25%", size: 2, opacity: 0.9 },
  { top: "35%", left: "45%", size: 2, opacity: 0.6 },
  { top: "60%", left: "60%", size: 3, opacity: 0.8 },
  { top: "28%", left: "85%", size: 2, opacity: 1.0 },
];

const MilkyWay: React.FC = () => (
  <div className="relative w-full h-64 bg-black overflow-hidden">
    {stars.map((star, idx) => (
      <div
        key={idx}
        className="absolute rounded-full bg-white shadow"
        style={{
          top: star.top,
          left: star.left,
          width: star.size ?? 2,
          height: star.size ?? 2,
          opacity: star.opacity ?? 0.8,
        }}
      />
    ))}
  </div>
);

export default MilkyWay;
