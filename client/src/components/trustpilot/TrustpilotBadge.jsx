import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, CheckCircle } from 'lucide-react';
import axios from 'axios';

export const TRUSTPILOT_REVIEW_URL = 'https://www.trustpilot.com/review/minoforge.com';
export const TRUSTPILOT_EVALUATE_URL = 'https://www.trustpilot.com/evaluate/minoforge.com';

/**
 * Shared Hook for Real-time Trustpilot Stats
 * If reviewsCount === 0, score is 0 and stars are 0!
 */
export const useTrustpilotStats = () => {
  const [stats, setStats] = useState({
    score: 0,
    reviewsCount: 0,
    stars: 0,
    domain: 'minoforge.com',
    reviewUrl: TRUSTPILOT_REVIEW_URL,
    evaluateUrl: TRUSTPILOT_EVALUATE_URL,
    businessUnitId: '',
    templateId: '5419b6a8b0d04a076446a9ad',
    loading: true
  });

  useEffect(() => {
    let isMounted = true;
    const loadStats = async () => {
      try {
        const res = await axios.get('/api/reviews/trustpilot');
        if (isMounted && res.data?.success) {
          const rawScore = Number(res.data.score || 0);
          const rawCount = Number(res.data.reviewsCount || 0);
          setStats({
            score: rawScore,
            reviewsCount: rawCount,
            stars: rawCount > 0 ? Math.round(rawScore) : 0,
            domain: res.data.domain || 'minoforge.com',
            reviewUrl: res.data.reviewUrl || TRUSTPILOT_REVIEW_URL,
            evaluateUrl: res.data.evaluateUrl || TRUSTPILOT_EVALUATE_URL,
            businessUnitId: res.data.businessUnitId || '',
            templateId: res.data.templateId || '5419b6a8b0d04a076446a9ad',
            loading: false
          });
        }
      } catch (e) {
        if (isMounted) setStats(prev => ({ ...prev, loading: false }));
      }
    };

    loadStats();
    // Poll every 60s for live updates
    const interval = setInterval(loadStats, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return stats;
};

// Official Trustpilot Star SVG with proper path and colors
export const TrustpilotStar = ({ className = "w-4 h-4", fill = "#00B67A" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 2l2.9 6.88 7.37.64-5.58 4.8 1.66 7.23L12 17.73l-6.35 3.82 1.66-7.23L1.73 9.52l7.37-.64L12 2z"
      fill={fill}
    />
  </svg>
);

/**
 * Dynamic Trustpilot Stars Block
 * If rating === 0 (or 0 reviews), all 5 boxes are dark/empty (0 stars filled)!
 * If rating > 0, it fills exact stars in Trustpilot green!
 */
export const TrustpilotFiveStars = ({ rating = 0, size = "sm" }) => {
  const boxClass = size === "lg" ? "w-7 h-7" : size === "md" ? "w-5 h-5" : "w-4 h-4";
  const starClass = size === "lg" ? "w-4 h-4" : size === "md" ? "w-3 h-3" : "w-2.5 h-2.5";
  const roundedRating = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));

  return (
    <div 
      className="inline-flex items-center gap-1"
      title={roundedRating === 0 ? "0 reviews on Trustpilot - Not yet rated" : `${Number(rating).toFixed(1)} / 5 stars on Trustpilot`}
    >
      {[1, 2, 3, 4, 5].map((idx) => {
        const isFilled = roundedRating > 0 && idx <= roundedRating;
        return (
          <div 
            key={idx} 
            className={`${boxClass} rounded-sm flex items-center justify-center flex-shrink-0 transition-all ${
              isFilled ? 'bg-[#00B67A] shadow-sm' : 'bg-slate-800/90 border border-white/10'
            }`}
          >
            <svg className={`${starClass} ${isFilled ? 'text-white fill-current' : 'text-slate-600 fill-current'}`} viewBox="0 0 24 24">
              <path d="M12 2l2.9 6.88 7.37.64-5.58 4.8 1.66 7.23L12 17.73l-6.35 3.82 1.66-7.23L1.73 9.52l7.37-.64L12 2z" />
            </svg>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Live Trustpilot Badge (Used in Navbar, Footer, and Checkout Cards)
 */
export const TrustpilotBadge = ({ compact = false, showStars = true }) => {
  const { score, reviewsCount, reviewUrl } = useTrustpilotStats();

  return (
    <a
      href={reviewUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2.5 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 border border-[#00B67A]/30 hover:border-[#00B67A] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#00B67A]/5 group cursor-pointer ${
        compact ? 'text-[11px] py-1 px-2.5' : ''
      }`}
      title={reviewsCount > 0 ? `${reviewsCount} reviews on Trustpilot` : "Review MinoForge on Trustpilot"}
    >
      <div className="flex items-center gap-1.5">
        <TrustpilotStar className="w-4 h-4 text-[#00B67A]" />
        <span className="font-black tracking-tight text-white group-hover:text-emerald-300 transition-colors">
          Trustpilot
        </span>
      </div>

      {showStars && (
        <>
          <div className="h-3 w-px bg-white/10 hidden sm:block" />
          <TrustpilotFiveStars rating={reviewsCount > 0 ? score : 0} size="sm" />
          <span className={`text-[11px] font-extrabold px-1.5 py-0.2 rounded border ${
            reviewsCount > 0 
              ? 'text-emerald-400 bg-[#00B67A]/15 border-[#00B67A]/30' 
              : 'text-slate-400 bg-slate-800 border-white/10'
          }`}>
            {reviewsCount > 0 ? score.toFixed(1) : '0 Reviews'}
          </span>
        </>
      )}

      <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition-colors" />
    </a>
  );
};

/**
 * Live Trustpilot Hero / Homepage Banner
 */
export const TrustpilotBanner = () => {
  const { score, reviewsCount, reviewUrl, evaluateUrl } = useTrustpilotStats();

  return (
    <div className="w-full bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#00B67A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left: Star rating & description */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5">
          <div className="w-14 h-14 rounded-2xl bg-[#00B67A]/15 border border-[#00B67A]/40 flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#00B67A]/20">
            <TrustpilotStar className="w-8 h-8 text-[#00B67A]" />
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-lg font-black text-white tracking-tight">
                {reviewsCount > 0 ? 'Rated on Trustpilot' : 'Review us on Trustpilot'}
              </span>
              <TrustpilotFiveStars rating={reviewsCount > 0 ? score : 0} size="md" />
              <span className={`text-xs font-black px-2 py-0.5 rounded-md border ${
                reviewsCount > 0 
                  ? 'text-emerald-400 bg-[#00B67A]/15 border-[#00B67A]/30' 
                  : 'text-slate-400 bg-slate-800 border-white/10'
              }`}>
                {reviewsCount > 0 ? `${score.toFixed(1)} / 5.0` : '0 Reviews'}
              </span>
            </div>
            
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              {reviewsCount > 0 
                ? `Based on ${reviewsCount} genuine customer reviews on Trustpilot. We provide authentic, verified marketplace plugins, secure payouts, and continuous malware protection.`
                : 'We have recently activated our official Trustpilot profile. Share your genuine feedback and be the first to review MinoForge on Trustpilot!'}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-[11px] text-slate-400 font-medium">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Verified Trustpilot Business Profile</span>
              </span>
              <span>&bull;</span>
              <span>Domain: <strong className="text-white font-mono">minoforge.com</strong></span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-shrink-0">
          <a
            href={reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-animated w-full sm:w-auto px-5 py-3 bg-[#00B67A] hover:bg-[#00a36d] text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-[#00B67A]/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>See Reviews on Trustpilot</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href={evaluateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-white/10 hover:border-white/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Write a Review</span>
          </a>
        </div>
      </div>
    </div>
  );
};

/**
 * Live Trustpilot Stars UI Strip (Displayed at the bottom / above footer)
 */
export const TrustpilotFooterBar = () => {
  const { score, reviewsCount, reviewUrl, evaluateUrl } = useTrustpilotStats();

  return (
    <div className="w-full bg-[#0d1522] border-y border-[#00B67A]/30 py-4 px-4 sm:px-6 relative overflow-hidden shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Official Trustpilot Star & Brand Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#00B67A]/15 border border-[#00B67A]/40 flex items-center justify-center flex-shrink-0">
            <TrustpilotStar className="w-5 h-5 text-[#00B67A]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-black text-sm tracking-tight">Trustpilot</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-[#00B67A]/20 px-2 py-0.5 rounded border border-[#00B67A]/30">
                OFFICIEEL GEVERIFIEERD
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {reviewsCount > 0 
                ? `${reviewsCount} geverifieerde beoordelingen van serverbeheerders op Trustpilot.` 
                : 'Echte geverifieerde beoordelingen — wees de allereerste reviewer op Trustpilot!'}
            </p>
          </div>
        </div>

        {/* Center: Live Stars & Score */}
        <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-2xl border border-white/10 shadow-inner">
          <span className="text-xs font-bold text-slate-300">
            {reviewsCount > 0 ? 'Score' : 'Nieuw'}
          </span>
          <TrustpilotFiveStars rating={reviewsCount > 0 ? score : 0} size="md" />
          <div className="flex items-baseline gap-1 text-xs">
            <span className="font-black text-white text-sm">
              {reviewsCount > 0 ? score.toFixed(1) : '0.0'}
            </span>
            <span className="text-slate-400 text-[11px]">
              {reviewsCount > 0 ? `(${reviewsCount} reviews)` : '(0 reviews)'}
            </span>
          </div>
        </div>

        {/* Right: Direct Review CTA */}
        <div className="flex items-center gap-2.5">
          <a
            href={evaluateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#00B67A] hover:bg-[#00a36d] text-slate-950 font-black text-xs rounded-xl shadow-md shadow-[#00B67A]/20 flex items-center gap-1.5 transition-all cursor-pointer font-bold"
          >
            <span>Schrijf Review op Trustpilot</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href={reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-white/10 transition-all flex items-center gap-1.5"
          >
            <span>Bekijk Trustpilot</span>
          </a>
        </div>

      </div>
    </div>
  );
};

/**
 * Checkout Trust Seal Component
 */
export const TrustpilotCheckoutSeal = () => {
  const { score, reviewsCount, reviewUrl } = useTrustpilotStats();

  return (
    <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-[#00B67A]/30 flex items-center justify-between gap-3 shadow-md">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-[#00B67A]/15 border border-[#00B67A]/40 flex items-center justify-center flex-shrink-0">
          <TrustpilotStar className="w-4 h-4 text-[#00B67A]" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-white">Trustpilot Verified</span>
            <TrustpilotFiveStars rating={reviewsCount > 0 ? score : 0} size="sm" />
          </div>
          <span className="text-[10px] text-slate-400">Automatic Feedback Service (AFS) Active</span>
        </div>
      </div>

      <a
        href={reviewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
      >
        <span>{reviewsCount > 0 ? `${score.toFixed(1)}/5` : '0 Reviews'}</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
};

/**
 * Official TrustBox Script & Dynamic Widget Renderer
 * Trustpilot executes its own live rendering engine here!
 */
export const TrustpilotTrustBox = ({
  templateId = "5419b6a8b0d04a076446a9ad",
  businessUnitId = "",
  height = "52px",
  width = "100%",
  theme = "dark"
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!businessUnitId) return;

    const scriptId = 'trustpilot-widget-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'text/javascript';
      script.src = '//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';
      script.async = true;
      document.head.appendChild(script);
    }

    if (window.Trustpilot && ref.current) {
      window.Trustpilot.loadFromElement(ref.current, true);
    }
  }, [businessUnitId, templateId]);

  if (!businessUnitId) {
    return null;
  }

  return (
    <div
      ref={ref}
      className="trustpilot-widget"
      data-locale="en-US"
      data-template-id={templateId}
      data-businessunit-id={businessUnitId}
      data-style-height={height}
      data-style-width={width}
      data-theme={theme}
      data-stars="1,2,3,4,5"
      data-review-languages="en,nl"
    >
      <a href={TRUSTPILOT_REVIEW_URL} target="_blank" rel="noopener noreferrer">
        Trustpilot
      </a>
    </div>
  );
};

export { default as TrustpilotReviewsSection } from './TrustpilotReviewsSection';
export default TrustpilotBadge;
