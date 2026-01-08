'use client';

interface BonsaiIconProps {
  size?: number;
  className?: string;
}

export default function BonsaiIcon({ size = 24, className = '' }: BonsaiIconProps) {
  return (
    <img
      src="/bonsaitransparent.svg"
      alt="Bonsai"
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
