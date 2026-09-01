import React, { useState, useEffect } from 'react';

const HERO_PHRASES = [
  {
    prefix: "Find the best plugins",
    suffix: "for your favorite games",
    gradient: "from-blue-400 via-cyan-300 to-indigo-300"
  },
  {
    prefix: "Supercharge your server",
    suffix: "with verified game addons",
    gradient: "from-cyan-400 via-teal-300 to-emerald-300"
  },
  {
    prefix: "Discover custom scripts",
    suffix: "built by top developers",
    gradient: "from-blue-400 via-indigo-300 to-purple-300"
  },
  {
    prefix: "Empower your community",
    suffix: "with next-gen game tools",
    gradient: "from-amber-400 via-orange-300 to-yellow-300"
  },
  {
    prefix: "Monetize your code",
    suffix: "and start selling today",
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
        // Finished typing full phrase: pause and celebrate
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
          {/* Cursor shows on line 1 only when suffix is empty and prefix is actively typed/deleted */}
          {displayedSuffix.length === 0 && (
            <span className="typewriter-cursor" aria-hidden="true" />
          )}
        </span>

        <br />

        {/* Gradient Suffix Line */}
        <span className={`bg-gradient-to-r ${currentPhrase.gradient} bg-clip-text text-transparent inline-block transition-all duration-300`}>
          {displayedSuffix || (displayedPrefix.length === currentPhrase.prefix.length ? '\u00A0' : '')}
          {/* Cursor shows on line 2 whenever suffix has text or line 1 is done */}
          {displayedSuffix.length > 0 && (
            <span className="typewriter-cursor" aria-hidden="true" />
          )}
        </span>
      </h1>
    </div>
  );
};

export default TypewriterHeroHeadline;
