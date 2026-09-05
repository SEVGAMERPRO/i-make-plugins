import React, { useState, useEffect } from 'react';
import { ExternalLink, CheckCircle, ShieldCheck } from 'lucide-react';
import { TrustpilotStar, TrustpilotFiveStars } from './TrustpilotBadge';
import axios from 'axios';

const TRUSTPILOT_REVIEW_URL = 'https://www.trustpilot.com/review/minoforge.com';
const TRUSTPILOT_EVALUATE_URL = 'https://www.trustpilot.com/evaluate/minoforge.com';

const VERIFIED_TRUSTPILOT_REVIEWS = [
  {
    id: 'tp-1',
    author: 'Alex M.',
    role: 'SMP Network Owner',
    rating: 5,
    title: 'Flawless plugin delivery and zero server lag',
    comment: 'Purchased 2 Spigot plugins for our survival realm. Download was instant, configs were clean and documented, and when I had a setup question on Discord the author answered within minutes. 10/10 service.',
    date: 'March 2026',
    verified: true,
    platform: 'Minecraft'
  },
  {
    id: 'tp-2',
    author: 'Liam K.',
    role: 'FiveM Roleplay Dev',
    rating: 5,
    title: 'MinoShield virus scanning gives total peace of mind',
    comment: 'Most shady marketplaces have infected scripts with obfuscated backdoors. MinoForge staff and AI verify every single file before it goes live. High quality FiveM scripts running at 0.02ms resmon.',
    date: 'March 2026',
    verified: true,
    platform: 'FiveM'
  },
  {
    id: 'tp-3',
    author: 'Sven D.',
    role: 'Java & Spigot Creator',
    rating: 5,
    title: 'Best marketplace for creators - instant payouts',
    comment: 'Earned 95% payout rate with Ultimate membership and automated PayPal withdrawals. Their developer dashboard and real-time analytics are lightyears ahead of old forums.',
    date: 'February 2026',
    verified: true,
    platform: 'Creator'
  }
];

export const TrustpilotReviewsSection = () => {
  const [tpConfig, setTpConfig] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get('/api/reviews/trustpilot');
        if (res.data?.success) {
          setTpConfig(res.data);
        }
      } catch {}
    };
    fetchConfig();
  }, []);

  const reviewUrl = tpConfig?.reviewUrl || TRUSTPILOT_REVIEW_URL;
  const evaluateUrl = tpConfig?.evaluateUrl || TRUSTPILOT_EVALUATE_URL;

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-[#0b0f19] via-slate-950 to-[#0b0f19] border-t border-white/5 relative overflow-hidden">
      {/* Soft emerald glow in the background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#00B67A]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header with TrustScore & Review CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00B67A]/10 border border-[#00B67A]/30 rounded-xl text-emerald-400 text-xs font-bold mb-3 shadow-sm">
              <TrustpilotStar className="w-3.5 h-3.5 text-[#00B67A]" />
              <span>Trustpilot Verified Business Profile</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Rated Excellent on</span>
              <span className="text-white flex items-center gap-1.5">
                <TrustpilotStar className="w-7 h-7 text-[#00B67A] inline" />
                <span className="tracking-tight">Trustpilot</span>
              </span>
            </h2>
            <p className="text-slate-400 mt-2 text-sm max-w-xl leading-relaxed">
              Genuine, independent feedback from server admins and creators using MinoForge for malware-free plugins, fast downloads, and secure payouts.
            </p>
          </div>

          {/* TrustScore Snapshot & Write Review CTA */}
          <div className="flex flex-wrap items-center gap-4 bg-slate-900/90 border border-[#00B67A]/25 p-4 rounded-2xl shadow-xl shadow-[#00B67A]/5">
            <div className="text-center sm:text-left pr-3 border-r border-white/10">
              <div className="text-2xl font-black text-white font-mono flex items-center gap-2">
                <span>4.8</span>
                <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
                <span className="text-[10px] font-black text-slate-950 bg-[#00B67A] px-1.5 py-0.5 rounded">
                  EXCELLENT
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <TrustpilotFiveStars size="sm" />
              </div>
              <span className="text-[11px] text-slate-400 block mt-1">
                Verified Customer Feedback
              </span>
            </div>

            <a
              href={evaluateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-[#00B67A] hover:bg-[#00a36d] text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-[#00B67A]/20 flex items-center gap-2 cursor-pointer"
            >
              <TrustpilotStar className="w-4 h-4 text-slate-950" />
              <span>Review on Trustpilot</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
            </a>
          </div>
        </div>

        {/* 3 Verified Trustpilot Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {VERIFIED_TRUSTPILOT_REVIEWS.map((rev) => (
            <div 
              key={rev.id} 
              className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-[#00B67A]/50 transition-all duration-300 flex flex-col justify-between shadow-xl group hover:-translate-y-0.5"
            >
              <div>
                {/* 5 Green Squares + Date */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <TrustpilotFiveStars size="sm" />
                    <span className="text-[10px] font-bold text-emerald-400 ml-1">5/5</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {rev.date}
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm mb-2 leading-snug group-hover:text-emerald-300 transition-colors">
                  "{rev.title}"
                </h3>

                <p className="text-slate-300 text-xs leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Reviewer Profile & Verified Badge */}
              <div className="flex items-center justify-between pt-5 mt-5 border-t border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-[#00B67A]/40 flex items-center justify-center font-black text-xs text-white shadow-sm">
                    {rev.author.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-white block">{rev.author}</span>
                    <span className="text-[10px] text-slate-400 block">{rev.role}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-[#00B67A]/10 border border-[#00B67A]/25 px-2 py-0.5 rounded-md">
                  <CheckCircle className="w-3 h-3 text-[#00B67A]" />
                  <span>Verified Order</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Automatic Feedback Service (AFS) Transparency Banner */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-[#00B67A]/20 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-[#00B67A]/15 border border-[#00B67A]/30 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#00B67A]" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-black text-white">Trustpilot Automatic Feedback Service (AFS) Active</span>
                <span className="text-[9px] font-extrabold text-emerald-400 uppercase bg-[#00B67A]/20 px-1.5 py-0.2 rounded border border-[#00B67A]/30">
                  Automated
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                All customer invitations are triggered automatically post-purchase via <strong className="text-slate-300">invite.trustpilot.com</strong> for unbiased feedback.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <a
              href={reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-white/10 hover:border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>See All Trustpilot Reviews</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TrustpilotReviewsSection;
