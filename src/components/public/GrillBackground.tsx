"use client";

export default function GrillBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#000000]">
      {/* Pure solid black backdrop without animations or glowing ambient colors */}
      <div className="absolute inset-0 bg-[#000000]" />
    </div>
  );
}
