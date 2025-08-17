// src/components/NFTCard.tsx
export interface NFTCardProps {
  title: string;
  price: string;
  imageUrl: string;
  className?: string;
}

export const NFTCard: React.FC<NFTCardProps> = ({
  title,
  price,
  imageUrl,
  className,
}) => {
  return (
    <div
      className={`relative w-64 h-76 bg-[#ffffff3b] backdrop-blur-md rounded-4xl p-4 shadow-2xl border-y border-white transition-all duration-300 ${className}`}
    >
      {/* Image container */}
      <div className="w-full h-48 mb-4 rounded-4xl overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover border-b-2 border-[#8C30F5]"
        />
      </div>

      {/* Title and price */}
      <div className="text-center space-y-2">
        <h3 className="text-white text-xl font-bold leading-tight">{title}</h3>
        <p className="text-white text-lg font-semibold">₳ {price}</p>
      </div>
    </div>
  );
};
