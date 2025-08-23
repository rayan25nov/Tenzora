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

const MilkyWay: React.FC = () => {
  // Generate smooth curved SVG path through all stars
  const generateCurvedPath = () => {
    if (stars.length < 2) return "";

    const points = stars.map((star) => ({
      x: parseFloat(star.left),
      y: parseFloat(star.top),
    }));

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const current = points[i];
      const previous = points[i - 1];

      if (i === 1) {
        // First curve - use quadratic
        const controlX = (previous.x + current.x) / 2;
        const controlY = (previous.y + current.y) / 2 - 5; // Slight curve upward
        path += ` Q ${controlX} ${controlY} ${current.x} ${current.y}`;
      } else {
        // Subsequent curves - use smooth cubic bezier
        const prev2 = points[i - 2];

        // Calculate control points for smooth curve
        const cp1x = previous.x + (current.x - prev2.x) * 0.2;
        const cp1y = previous.y + (current.y - prev2.y) * 0.2;
        const cp2x =
          current.x -
          (points[Math.min(i + 1, points.length - 1)].x - previous.x) * 0.2;
        const cp2y =
          current.y -
          (points[Math.min(i + 1, points.length - 1)].y - previous.y) * 0.2;

        path += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${current.x} ${current.y}`;
      }
    }

    return path;
  };

  return (
    <div className="relative w-full h-64 bg-black overflow-hidden">
      {/* SVG curved line connecting the stars */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d={generateCurvedPath()}
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="0.15"
          fill="none"
          className="animate-pulse"
          style={{
            filter: "drop-shadow(0 0 2px rgba(255, 255, 255, 0.3))",
          }}
        />
      </svg>

      {/* Stars */}
      {stars.map((star, idx) => (
        <div
          key={idx}
          className="absolute rounded-full bg-white shadow-lg"
          style={{
            top: star.top,
            left: star.left,
            width: star.size ?? 2,
            height: star.size ?? 2,
            opacity: star.opacity ?? 0.8,
            boxShadow: "0 0 4px rgba(255, 255, 255, 0.6)",
          }}
        />
      ))}
    </div>
  );
};

export default MilkyWay;
