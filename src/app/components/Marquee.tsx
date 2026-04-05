import React from "react";

interface MarqueeProps {
  text: string;
  className?: string;
}

export default function Marquee({ text, className = "" }: MarqueeProps) {
  const items = Array(20).fill(text);

  return (
    <div
      className={`relative overflow-hidden bg-linear-to-r from-blue-600 to-blue-500 py-4 ${className}`}
    >
      <div className="animate-scroll-rtl">
        {items.map((item, index) => (
          <span
            key={index}
            className="inline-block px-8 text-white font-semibold text-xl md:text-2xl whitespace-nowrap"
          >
            {item}
          </span>
        ))}
      </div>
      {/* Fade effect overlays */}
      <div className="marquee-fade-left"></div>
      <div className="marquee-fade-right"></div>
    </div>
  );
}
