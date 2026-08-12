'use client';
import React from 'react';

export default function AthenaLogo({
  size = 'md',
  showText = true,
  subtitle = 'UNESCO 2026',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  subtitle?: string;
  className?: string;
}) {
  const containerDimensions = size === 'sm' ? 'w-7 h-7 rounded-lg' : size === 'lg' ? 'w-12 h-12 rounded-2xl' : 'w-9 h-9 rounded-xl';
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className={`flex items-center gap-2.5 group ${className}`}>
      <div className={`${containerDimensions} bg-gradient-to-tr from-sky-500 to-teal-400 p-0.5 shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform shrink-0 overflow-hidden`}>
        <img
          src="/logo.jpeg"
          alt="ATHENA Logo"
          className="w-full h-full object-cover rounded-[inherit]"
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span
            className={`${textSize} font-bold tracking-wide font-editorial flex items-center gap-1.5`}
            style={{ color: 'var(--color-text-main)' }}
          >
            ATHENA
            {subtitle && (
              <span className="text-[10px] px-1.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-sans font-normal">
                {subtitle}
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
