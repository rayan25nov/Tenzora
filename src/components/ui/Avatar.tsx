import { ReactNode } from "react";

export const Avatar = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={`w-10 h-10 rounded-full overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export const AvatarImage = ({
  src,
  alt = "avatar",
  className = "",
}: {
  src: string;
  alt?: string;
  className?: string;
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`w-full h-full object-cover ${className}`}
    />
  );
};
