import React, { useState, useEffect } from 'react';

const HERO_PHRASES = [
  {
    prefix: "The Game Plugin Marketplace",
    suffix: "for Minecraft, FiveM, Rust & Discord",
    gradient: "from-blue-400 via-cyan-300 to-sky-300"
  },
  {
    prefix: "Verified Server Plugins & Scripts",
    suffix: "instant delivery, clean bytecode",
    gradient: "from-cyan-400 via-teal-300 to-emerald-300"
  },
  {
    prefix: "Custom Game Development",
    suffix: "built to order for your community",
    gradient: "from-blue-400 via-indigo-300 to-cyan-300"
  },
  {
    prefix: "Level Up Your Game Server",
    suffix: "with tested, high-performance tools",
    gradient: "from-amber-400 via-yellow-300 to-amber-200"
  },
  {
    prefix: "Publish Your Plugins & Scripts",
    suffix: "and earn revenue with 0% platform fees",
    gradient: "from-emerald-400 via-teal-300 to-cyan-300"
  }
];

const TypewriterHeroHeadline = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedPrefix, setDisplayedPrefix] = useState(HERO_PHRASES[0].prefix);
  const [displayedSuffix, setDisplayedSuffix] = useState(HERO_PHRASES[0].suffix);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  const currentPhrase = HERO_PHRASES[phraseIndex];

  useEffect(() => {
    let timeout;

    // 1. If paused at full text, wait 4.2 seconds before starting deletion
    if (isPaused) {
      timeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 4200);
      return () => clearTimeout(timeout);
    }

    // 2. Deleting Phase
    if (isDeleting) {
      if (displayedSuffix.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedSuffix(prev => prev.slice(0, -1));
        }, 22);
      } else if (displayedPrefix.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedPrefix(prev => prev.slice(0, -1));
        }, 28);
      } else {
        // Both are cleared: move to next phrase
        timeout = setTimeout(() => {
          setPhraseIndex(prev => (prev + 1) % HERO_PHRASES.length);
          setIsDeleting(false);
        }, 250);
      }
      return () => clearTimeout(timeout);
    }

    // 3. Typing Phase
    if (!isDeleting) {
      const targetPrefix = currentPhrase.prefix;
      const targetSuffix = currentPhrase.suffix;

      if (displayedPrefix.length < targetPrefix.length) {
        timeout = setTimeout(() => {
          setDisplayedPrefix(targetPrefix.slice(0, displayedPrefix.length + 1));
        }, 45 + Math.random() * 20);
      } else if (displayedSuffix.length < targetSuffix.length) {
        timeout = setTimeout(() => {
          setDisplayedSuffix(targetSuffix.slice(0, displayedSuffix.length + 1));
        }, 40 + Math.random() * 15);
      } else {
        // Finished typing full phrase: pause
        setIsPaused(true);
      }
      return () => clearTimeout(timeout);
    }
  }, [displayedPrefix, displayedSuffix, isDeleting, isPaused, phraseIndex, currentPhrase]);

  return (
    <div className="min-h-[130px] sm:min-h-[170px] md:min-h-[210px] lg:min-h-[230px] flex flex-col justify-center items-center select-none">
      <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 sm:mb-6 tracking-tight leading-tight drop-shadow-2xl text-center">
        {/* Top Prefix Line */}
        <span className="inline-block transition-opacity duration-200">
          {displayedPrefix}
        </span>

        <br />

        {/* Gradient Suffix Line */}
        <span className={`bg-gradient-to-r ${currentPhrase.gradient} bg-clip-text text-transparent inline-block transition-all duration-300`}>
          {displayedSuffix || (displayedPrefix.length === currentPhrase.prefix.length ? '\u00A0' : '')}
        </span>
      </h1>
    </div>
  );
};

export default TypewriterHeroHeadline;
