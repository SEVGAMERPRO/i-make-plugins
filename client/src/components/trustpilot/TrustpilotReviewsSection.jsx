import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, CheckCircle, ShieldCheck, Star, Plus, MessageSquare, AlertCircle } from 'lucide-react';
import { TrustpilotStar, TrustpilotFiveStars, useTrustpilotStats } from './TrustpilotBadge';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TRUSTPILOT_REVIEW_URL = 'https://www.trustpilot.com/review/minoforge.com';
const TRUSTPILOT_EVALUATE_URL = 'https://www.trustpilot.com/evaluate/minoforge.com';

export const TrustpilotReviewsSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const trustBoxRef = useRef(null);

  const tpStats = useTrustpilotStats();
  const [realReviews, setRealReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  // Write Review Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5.0);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchReviews = async () => {
    try {
      const res = await axios.get('/api/reviews/platform');
      if (res.data?.success) {
        setRealReviews(res.data.reviews || []);
        setAvgRating(res.data.averageRating || 0);
        setTotalReviews(res.data.totalReviews || 0);
      }
    } catch (e) {
      console.error('Failed to load reviews', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Initialize official Trustpilot widget if Business Unit ID is present
  useEffect(() => {
    if (tpStats?.businessUnitId && trustBoxRef.current && window.Trustpilot) {
      window.Trustpilot.loadFromElement(trustBoxRef.current, true);
    }
  }, [tpStats]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMsg('Please log in to submit your review.');
        setSubmitting(false);
        return;
      }

      const res = await axios.post('/api/reviews/platform', {
        rating: newRating,
        title: newTitle.trim() || 'Verified Experience',
        comment: newComment.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.success) {
        setSuccessMsg('Thank you! Your verified review has been published.');
        setNewComment('');
        setNewTitle('');
        await fetchReviews();
        setTimeout(() => {
          setIsModalOpen(false);
          setSuccessMsg('');
        }, 1800);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  const reviewUrl = tpStats?.reviewUrl || TRUSTPILOT_REVIEW_URL;
  const evaluateUrl = tpStats?.evaluateUrl || TRUSTPILOT_EVALUATE_URL;

  // Real review counts: either from Trustpilot stats or platform verified reviews
  const displayReviewCount = tpStats.reviewsCount > 0 ? tpStats.reviewsCount : totalReviews;
  const displayScore = tpStats.reviewsCount > 0 ? tpStats.score : (totalReviews > 0 ? avgRating : 0);

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-[#0b0f19] via-slate-950 to-[#0b0f19] border-t border-white/5 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#00B67A]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header with Trustpilot verification and Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00B67A]/10 border border-[#00B67A]/30 rounded-xl text-emerald-400 text-xs font-bold mb-3 shadow-sm">
              <TrustpilotStar className="w-3.5 h-3.5 text-[#00B67A]" />
              <span>Trustpilot Verified Business Profile</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Customer Reviews &amp;</span>
              <span className="text-white flex items-center gap-1.5">
                <TrustpilotStar className="w-7 h-7 text-[#00B67A] inline" />
                <span className="tracking-tight">Trustpilot</span>
              </span>
            </h2>
            <p className="text-slate-400 mt-2 text-sm max-w-xl leading-relaxed">
              Real, authentic feedback from verified server owners and creators who rely on MinoForge. No fabricated reviews — only genuine customer experiences.
            </p>
          </div>

          {/* Rating Snapshot & CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-900/90 border border-[#00B67A]/25 p-4 rounded-2xl shadow-xl shadow-[#00B67A]/5">
            <div className="text-center sm:text-left pr-3 border-r border-white/10">
              {displayReviewCount > 0 ? (
                <>
                  <div className="text-2xl font-black text-white font-mono flex items-center gap-2">
                    <span>{displayScore.toFixed(1)}</span>
                    <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
                    <span className="text-[10px] font-black text-slate-950 bg-[#00B67A] px-1.5 py-0.5 rounded">
                      VERIFIED
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    <TrustpilotFiveStars rating={displayScore} size="sm" />
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    {displayReviewCount} {displayReviewCount === 1 ? 'real review' : 'real reviews'}
                  </span>
                </>
              ) : (
                <>
                  <div className="text-base font-bold text-white flex items-center gap-1.5">
                    <TrustpilotStar className="w-4 h-4 text-[#00B67A]" />
                    <span>Trustpilot Active</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    <TrustpilotFiveStars rating={0} size="sm" />
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    0 reviews • Be the first to review us
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <a
                href={evaluateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 bg-[#00B67A] hover:bg-[#00a36d] text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-[#00B67A]/20 flex items-center justify-center gap-2 cursor-pointer"
                title="Write a real review on Trustpilot"
              >
                <TrustpilotStar className="w-4 h-4 text-slate-950" />
                <span>Review on Trustpilot</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
              </a>

              <button
                onClick={() => {
                  if (!user) {
                    navigate('/login?redirect=/');
                    return;
                  }
                  setIsModalOpen(true);
                }}
                className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Write Website Review</span>
              </button>
            </div>
          </div>
        </div>

        {/* Official TrustBox Widget (rendered if businessUnitId is configured) */}
        {tpStats?.businessUnitId && (
          <div className="mb-8 p-4 rounded-2xl bg-slate-900/60 border border-[#00B67A]/20 overflow-hidden">
            <div
              ref={trustBoxRef}
              className="trustpilot-widget"
              data-locale="en-US"
              data-template-id={tpStats.templateId || "5419b6a8b0d04a076446a9ad"}
              data-businessunit-id={tpStats.businessUnitId}
              data-style-height="52px"
              data-style-width="100%"
              data-theme="dark"
              data-stars="1,2,3,4,5"
              data-review-languages="en,nl"
            >
              <a href={reviewUrl} target="_blank" rel="noopener noreferrer">
                Trustpilot
              </a>
            </div>
          </div>
        )}

        {/* Reviews Showcase: Real reviews only, or transparent Trustpilot empty invite */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs animate-pulse">
            Loading verified reviews...
          </div>
        ) : realReviews.length === 0 ? (
          /* Honest Empty State with zero fake reviews */
          <div className="p-10 sm:p-12 text-center bg-slate-900/40 rounded-3xl border border-white/10 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#00B67A]/15 border border-[#00B67A]/30 flex items-center justify-center text-[#00B67A] font-bold mx-auto text-2xl shadow-lg shadow-[#00B67A]/10">
              <TrustpilotStar className="w-8 h-8 text-[#00B67A]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-white text-lg tracking-tight">No Reviews Yet on Trustpilot</h3>
              <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
                We believe in 100% transparency. Our official Trustpilot page was recently activated. Have you downloaded or purchased a plugin? Share your genuine feedback!
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href={evaluateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-[#00B67A] hover:bg-[#00a36d] text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg shadow-[#00B67A]/20 inline-flex items-center gap-2 cursor-pointer"
              >
                <TrustpilotStar className="w-4 h-4 text-slate-950" />
                <span>Write the First Review on Trustpilot</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-950" />
              </a>

              <button
                onClick={() => {
                  if (!user) {
                    navigate('/login?redirect=/');
                    return;
                  }
                  setIsModalOpen(true);
                }}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-white/10 transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Write Website Review</span>
              </button>
            </div>
          </div>
        ) : (
          /* Grid of REAL reviews submitted by real registered users */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {realReviews.map((rev) => (
              <div 
                key={rev.id} 
                className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-[#00B67A]/50 transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((starIdx) => (
                          <div
                            key={starIdx}
                            className={`w-4 h-4 rounded-sm flex items-center justify-center ${
                              starIdx <= Math.round(rev.rating) ? 'bg-[#00B67A]' : 'bg-slate-800'
                            }`}
                          >
                            <TrustpilotStar className="w-2.5 h-2.5 text-white" />
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 ml-1 font-mono">
                        {Number(rev.rating).toFixed(1)}/5
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-sm mb-2 leading-snug">
                    "{rev.title}"
                  </h3>

                  <p className="text-slate-300 text-xs leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-5 mt-5 border-t border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 overflow-hidden flex items-center justify-center font-bold text-xs text-white">
                      {rev.avatarUrl && !rev.avatarUrl.includes('default') ? (
                        <img src={rev.avatarUrl} alt={rev.username} className="w-full h-full object-cover" />
                      ) : (
                        rev.username ? rev.username.charAt(0).toUpperCase() : 'U'
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-white block truncate max-w-[120px]">{rev.username}</span>
                      <span className="text-[10px] text-slate-400 block">Community Member</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-[#00B67A]/10 border border-[#00B67A]/25 px-2 py-0.5 rounded-md">
                    <CheckCircle className="w-3 h-3 text-[#00B67A]" />
                    <span>Verified User</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Automatic Feedback Service (AFS) Transparency Banner */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-[#00B67A]/20 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg mt-8">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-[#00B67A]/15 border border-[#00B67A]/30 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#00B67A]" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-black text-white">Trustpilot Automatic Feedback Service (AFS) Active</span>
                <span className="text-[9px] font-extrabold text-emerald-400 uppercase bg-[#00B67A]/20 px-1.5 py-0.2 rounded border border-[#00B67A]/30">
                  Official
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Every verified purchase triggers an automatic Trustpilot email invitation via <strong className="text-slate-300">invite.trustpilot.com</strong> to guarantee genuine, unedited reviews.
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
              <span>See Trustpilot Profile</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>

      {/* Write Website Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#00B67A]/15 border border-[#00B67A]/30 flex items-center justify-center text-[#00B67A] font-bold">
                  <Star className="w-5 h-5 text-[#00B67A] fill-current" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-white">Write Real Website Review</h3>
                  <p className="text-xs text-slate-400">Share your honest experience on MinoForge speed and plugins.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Star Rating Picker */}
              <div className="p-4 bg-slate-950/90 rounded-2xl border border-white/10 text-center space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Rating: {newRating.toFixed(1)} Stars
                </label>
                <div className="flex items-center justify-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        star <= newRating ? 'bg-[#00B67A] shadow-md shadow-[#00B67A]/30' : 'bg-slate-800'
                      }`}>
                        <TrustpilotStar className="w-4 h-4 text-white" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Review Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Instant download and clean code"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00B67A]"
                />
              </div>

              {/* Comment Message */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Your Honest Review *
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="Tell other server admins and developers about your experience..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00B67A] resize-none"
                />
              </div>

              {successMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#00B67A] hover:bg-[#00a36d] text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-[#00B67A]/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Publishing...' : 'Publish Real Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};

export default TrustpilotReviewsSection;
