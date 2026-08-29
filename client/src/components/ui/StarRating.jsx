import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({
  rating = 5.0,
  size = 'md',
  interactive = false,
  onChange = null,
  showValue = true,
  className = ''
}) {
  const [hoverRating, setHoverRating] = useState(null);
  const currentRating = hoverRating !== null ? hoverRating : (parseFloat(rating) || 5.0);

  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  };

  const textClasses = {
    sm: 'text-xs',
    md: 'text-sm font-bold',
    lg: 'text-base font-bold',
    xl: 'text-xl font-black'
  };

  const handleSliderChange = (e) => {
    const val = parseFloat(e.target.value);
    if (onChange) onChange(val);
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {/* 5 Stars with fractional .1 fill support */}
      <div className="relative flex items-center gap-0.5">
        {[0, 1, 2, 3, 4].map((index) => {
          const fillPercent = Math.max(0, Math.min(100, (currentRating - index) * 100));

          return (
            <div
              key={index}
              className="relative cursor-pointer select-none"
              onClick={() => interactive && onChange && onChange(index + 1.0)}
            >
              {/* Background Gray/Slate Star */}
              <Star className={`${sizeClasses[size] || sizeClasses.md} text-slate-700 fill-slate-800/80 stroke-slate-600/50`} />

              {/* Foreground Golden Star with Clip Width */}
              {fillPercent > 0 && (
                <div
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                  style={{ width: `${fillPercent}%` }}
                >
                  <Star className={`${sizeClasses[size] || sizeClasses.md} text-amber-400 fill-amber-400 filter drop-shadow-[0_1px_3px_rgba(245,158,11,0.5)]`} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Numeric Decimal Value (e.g. 4.8) */}
      {showValue && (
        <span className={`text-amber-300 font-mono ${textClasses[size] || textClasses.md}`}>
          {currentRating.toFixed(1)}
        </span>
      )}

      {/* Interactive Range Slider with .1 step precision */}
      {interactive && (
        <div className="flex items-center gap-2 ml-2">
          <input
            type="range"
            min="1.0"
            max="5.0"
            step="0.1"
            value={currentRating}
            onChange={handleSliderChange}
            className="w-24 sm:w-32 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
