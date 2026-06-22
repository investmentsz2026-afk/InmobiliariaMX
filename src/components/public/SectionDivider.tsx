import React from "react";

interface SectionDividerProps {
  title: string;
  icon?: React.ComponentType<any>;
}

export default function SectionDivider({ title, icon: Icon }: SectionDividerProps) {
  return (
    <div className="flex items-center justify-center gap-4 py-12 select-none">
      <div className="h-[1px] bg-gradient-to-r from-transparent via-gold-400/30 to-gold-400/60 flex-grow max-w-[100px] sm:max-w-[200px]" />
      <div className="flex items-center gap-2.5 text-gold-400">
        {Icon && <Icon className="w-5 h-5 text-gold-400 animate-pulse shrink-0" />}
        <h2 className="font-serif text-lg sm:text-2xl md:text-3xl font-bold tracking-[0.2em] uppercase text-white drop-shadow-[0_2px_10px_rgba(212,175,55,0.1)]">
          {title}
        </h2>
      </div>
      <div className="h-[1px] bg-gradient-to-l from-transparent via-gold-400/30 to-gold-400/60 flex-grow max-w-[100px] sm:max-w-[200px]" />
    </div>
  );
}
