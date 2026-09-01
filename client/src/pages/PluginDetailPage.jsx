import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, Download, Clock, Tag, ShieldCheck, ChevronRight, Sparkles, Terminal, FileCode, CheckCircle2, User, Share2, Check, CreditCard, ShoppingCart, MessageSquare, ExternalLink, Cpu, Layers, AlertCircle, History, FileText, Key, Award, Flame, Zap, CheckCircle, Bell, BellOff, Users, GitFork, PackageCheck, AlertTriangle, FileArchive, Lock, ThumbsUp } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StarRating from '../components/ui/StarRating';
import MinoShieldBadge from '../components/security/MinoShieldBadge';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { getPluginById } from '../services/api';

const SAMPLE_PLUGINS_DATABASE = {
  'p-bot-3': {
    id: 'p-bot-3',
    title: 'Discord Ticket & Transcripts Bot',
    authorName: 'BotCrafter',
    gameName: 'Discord',
    price: '0.00',
    rating: '5.0',
    reviewsCount: 0,
    downloads: 0,
    version: 'v1.0.0',
    lastUpdated: '3 weeks ago',
    category: 'Community & Moderation',
    coverImageUrl: '/images/plugins/discord_ticket_panel.svg',
    screenshots: [
      '/images/plugins/discord_ticket_panel.svg'
    ],
    downloadUrl: '/downloads/DiscordTicketBot-v1.0.0.zip',
    summary: 'Automated ticket buttons, transcript HTML archiving, and staff rating system for Discord servers.',
    overview: `
      <h3>Automated Support Desk & HTML Archiving (Discord.js v14)</h3>
      <p>A support ticketing bot built for gaming servers, marketplaces, and developer communities. Replaces unorganized direct messages with clean, private channels with automatic HTML transcript generation.</p>
      <br/>
      <h4>⚡ Core Engine Features</h4>
      <ul>
        <li><strong>1-Click Button & Modal Panel:</strong> Deploy interactive panels in <code>#support</code> with modal forms requesting user issue summaries.</li>
        <li><strong>Self-Hosted HTML Transcripts:</strong> On ticket closure, exports complete visual HTML archives with message history, embeds, attachments, and timestamps to <code>#ticket-logs</code>.</li>
        <li><strong>Role-Based Privacy:</strong> Automatic permission overwrites ensuring only assigned Support Staff and the ticket creator can view channel messages.</li>
        <li><strong>Staff Performance Star Ratings:</strong> Prompts the user for 1-5 star staff satisfaction reviews upon ticket resolution.</li>
        <li><strong>Idle Ticket Auto-Close:</strong> Automatically warns and closes inactive tickets after 24 hours without moderator activity.</li>
      </ul>
    `,
    installation: `
      <div class="mb-4 p-3.5 bg-blue-500/15 border border-blue-400/30 rounded-xl text-blue-200 text-xs">
        <strong>⚡ Quick 1-Click Setup:</strong> Run the <code>install.bat</code> file inside the zip to download everything automatically, then just configure your bot in <code>config.example.json</code>!
      </div>
      <h4>Step-by-Step Installation Guide (README.txt)</h4>
      <ol>
        <li><strong>1-Click Install:</strong> Double click <code>install.bat</code> (or run <code>npm install</code> in terminal).</li>
        <li><strong>Discord Developer Portal:</strong> Create a bot at <a href="https://discord.com/developers/applications" target="_blank" rel="noreferrer" class="text-blue-400 hover:underline">discord.com/developers</a>. Enable <em>Server Members Intent</em> and <em>Message Content Intent</em> under the Bot tab.</li>
        <li><strong>Configuration:</strong> Rename <code>config.example.json</code> to <code>config.json</code> and paste your Bot Token and Server IDs.</li>
        <li><strong>Start the Bot:</strong> Run <code>node index.js</code> (or use PM2 for 24/7 hosting: <code>pm2 start index.js --name ticket-bot</code>).</li>
        <li><strong>Deploy Panel:</strong> Run <code>/ticket setup</code> in your Discord server #support channel!</li>
      </ol>
    `,
    commands: `
      <h4>All Available Commands & Permissions</h4>
      <table class="w-full text-left text-xs border border-white/10 mt-2 rounded-lg overflow-hidden">
        <thead class="bg-slate-800 text-slate-300">
          <tr>
            <th class="p-2.5 border-b border-white/10">Command</th>
            <th class="p-2.5 border-b border-white/10">Permission</th>
            <th class="p-2.5 border-b border-white/10">Description</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5 text-slate-300">
          <tr>
            <td class="p-2.5 font-mono text-blue-400">/ticket setup</td>
            <td class="p-2.5 text-amber-400 font-semibold">Administrator</td>
            <td class="p-2.5">Deploys the interactive button panel to current channel</td>
          </tr>
          <tr>
            <td class="p-2.5 font-mono text-blue-400">/ticket close [reason]</td>
            <td class="p-2.5 text-emerald-400 font-semibold">Staff & Creator</td>
            <td class="p-2.5">Closes ticket, logs reason, and exports HTML transcript</td>
          </tr>
          <tr>
            <td class="p-2.5 font-mono text-blue-400">/ticket add @user</td>
            <td class="p-2.5 text-purple-400 font-semibold">Staff Only</td>
            <td class="p-2.5">Grants another user access to the active ticket</td>
          </tr>
          <tr>
            <td class="p-2.5 font-mono text-blue-400">/ticket remove @user</td>
            <td class="p-2.5 text-purple-400 font-semibold">Staff Only</td>
            <td class="p-2.5">Removes a user from the active ticket</td>
          </tr>
          <tr>
            <td class="p-2.5 font-mono text-blue-400">/ticket rename [name]</td>
            <td class="p-2.5 text-purple-400 font-semibold">Staff Only</td>
            <td class="p-2.5">Renames the active ticket channel</td>
          </tr>
          <tr>
            <td class="p-2.5 font-mono text-blue-400">/ticket transcript</td>
            <td class="p-2.5 text-purple-400 font-semibold">Staff Only</td>
            <td class="p-2.5">Generates an instant HTML transcript without closing</td>
          </tr>
          <tr>
            <td class="p-2.5 font-mono text-blue-400">/ticket stats [@staff]</td>
            <td class="p-2.5 text-purple-400 font-semibold">Staff Only</td>
            <td class="p-2.5">View ticket resolution volume and average star rating</td>
          </tr>
        </tbody>
      </table>
    `,
    configSample: `// Discord Ticket Bot Configuration (config.json)
// Format: JSON

{
  "botToken": "YOUR_DISCORD_BOT_TOKEN_HERE",
  "clientId": "YOUR_DISCORD_APPLICATION_CLIENT_ID",
  "guildId": "YOUR_DISCORD_SERVER_ID",
  "ticketCategoryChannelId": "CATEGORY_CHANNEL_ID_FOR_TICKETS",
  "transcriptLogsChannelId": "TEXT_CHANNEL_ID_FOR_HTML_TRANSCRIPTS",
  "supportStaffRoleId": "ROLE_ID_OF_YOUR_SUPPORT_STAFF",
  "maxOpenTicketsPerUser": 2,
  "askFeedbackOnClose": true,
  "autoCloseInactiveHours": 24
}
`
  }
};

const PluginDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart, isInCart, setIsCheckoutOpen, openCheckoutWithMethod } = useCart();
  const { formatPrice } = useCurrency();
  const [plugin, setPlugin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [userLicense, setUserLicense] = useState(null);
  const [copiedLic, setCopiedLic] = useState(false);

  useEffect(() => {
    const fetchPlugin = async () => {
      setLoading(true);
      try {
        const data = await getPluginById(id);
        if (data) {
          setPlugin(data);
        } else if (SAMPLE_PLUGINS_DATABASE[id]) {
          setPlugin(SAMPLE_PLUGINS_DATABASE[id]);
        }
      } catch (err) {
        if (SAMPLE_PLUGINS_DATABASE[id]) {
          setPlugin(SAMPLE_PLUGINS_DATABASE[id]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPlugin();
  }, [id]);

  // Review states
  const [pluginReviews, setPluginReviews] = useState([]);
  const [canUserReview, setCanUserReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5.0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewStatus, setReviewStatus] = useState({ type: '', message: '' });

  const fetchPluginReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`/api/reviews/plugin/${id}`, { headers });
      if (res.data?.success) {
        setPluginReviews(res.data.reviews || []);
        setCanUserReview(Boolean(res.data.canReview));
      }
    } catch {}
  };

  useEffect(() => {
    fetchPluginReviews();
  }, [id]);

  const handlePostPluginReview = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setReviewSubmitting(true);
    setReviewStatus({ type: '', message: '' });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setReviewStatus({ type: 'error', message: 'Please log in to submit a verified review.' });
        setReviewSubmitting(false);
        return;
      }

      const res = await axios.post(`/api/reviews/plugin/${id}`, {
        rating: reviewRating,
        title: reviewTitle.trim() || `${plugin?.title || 'Resource'} Review`,
        comment: reviewComment.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.success) {
        setReviewStatus({ type: 'success', message: '⭐ Your review has been verified and published!' });
        setReviewComment('');
        setReviewTitle('');
        if (res.data.averageRating) {
          setPlugin(prev => ({ ...prev, rating: res.data.averageRating, reviewsCount: res.data.totalReviews }));
        }
        fetchPluginReviews();
      }
    } catch (err) {
      setReviewStatus({
        type: 'error',
        message: err.response?.data?.message || '🔒 Verified purchase required. You must purchase this resource before submitting a review for the seller.'
      });
    } finally {
      setReviewSubmitting(false);
    }
  };

  useEffect(() => {
    try {
      const licenses = JSON.parse(localStorage.getItem('minoforge_licenses') || '[]');
      const found = licenses.find(l => l.pluginId === id || l.pluginTitle === plugin?.title);
      if (found) setUserLicense(found);
    } catch {}
  }, [id, plugin]);

  const handleDownload = () => {
    if (!user) {
      navigate(`/login?redirect=/plugins/${id}`);
      return;
    }
    const url = plugin?.downloadUrl || '/downloads/UltimateEconomy-v2.4.0.zip';
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handlePurchaseOrAddToCart = (openCheckout = false) => {
    if (!user) {
      navigate(`/login?redirect=/plugins/${id}`);
      return;
    }
    addToCart(plugin, openCheckout);
  };

  if (loading) return <LoadingSpinner />;
  if (!plugin) return <div className="text-center py-20 text-xl text-slate-400">Plugin not found</div>;

  const isFree = parseFloat(plugin.price) === 0 || plugin.price === '0.00' || plugin.price === 'Free';

  const [isWatched, setIsWatched] = useState(() => {
    try {
      const watched = JSON.parse(localStorage.getItem('minoforge_watched_plugins') || '[]');
      return watched.includes(id);
    } catch {
      return false;
    }
  });
  const [watchToast, setWatchToast] = useState(false);

  const toggleWatch = () => {
    try {
      const watched = JSON.parse(localStorage.getItem('minoforge_watched_plugins') || '[]');
      let updated;
      if (watched.includes(id)) {
        updated = watched.filter(item => item !== id);
        setIsWatched(false);
      } else {
        updated = [...watched, id];
        setIsWatched(true);
        setWatchToast(true);
        setTimeout(() => setWatchToast(false), 3000);
      }
      localStorage.setItem('minoforge_watched_plugins', JSON.stringify(updated));
    } catch {}
  };

  return (
    <div className="bg-[#0b0f19] min-h-screen text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link to="/" className="hover:text-blue-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/plugins" className="hover:text-blue-400">Marketplace</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white font-medium truncate">{plugin.title}</span>
        </div>

        {/* Watch Alert Toast */}
        {watchToast && (
          <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-blue-600/30 to-cyan-500/30 border border-blue-500/40 text-xs font-bold text-cyan-200 flex items-center gap-2 shadow-xl animate-fade-in">
            <Bell className="w-4 h-4 text-cyan-400 animate-bounce" />
            <span>🔔 You are now watching <strong>{plugin.title}</strong>! You will receive email &amp; Discord alerts for new patches.</span>
          </div>
        )}

        {/* Flash Sale Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-red-500/20 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg shadow-amber-500/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0 animate-pulse">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black uppercase text-amber-300 tracking-wide block">
                🔥 Summer Launch Flash Sale — 20% OFF
              </span>
              <span className="text-[11px] text-slate-300">
                Use promo code <code className="bg-slate-950 px-2 py-0.5 rounded text-amber-400 font-mono font-bold">MINO20</code> in your cart!
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-amber-500/20">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>05h : 22m : 14s remaining</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Main Column */}
          <div className="flex-1 w-full space-y-8">
            
            {/* Header Showcase Card */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="aspect-[21/9] w-full bg-slate-950 relative overflow-hidden">
                <img 
                  src={plugin.coverImageUrl || '/images/categories/minecraft.png'} 
                  alt={plugin.title}
                  className="w-full h-full object-cover filter brightness-85" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md rounded-xl text-[10px] font-black uppercase flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    <span>FEATURED RESOURCE</span>
                  </span>
                  <span className="px-3.5 py-1.5 bg-slate-900/90 backdrop-blur-md rounded-xl text-xs font-extrabold text-blue-400 border border-white/10 shadow-lg">
                    {plugin.gameName || plugin.game}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight mb-2">
                      {plugin.title}
                    </h1>
                    
                    {/* Multi-Author Collaborations & Revenue Split Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-400 flex-wrap">
                        <span className="text-xs text-slate-400">Primary Author:</span>
                        <Link to={`/users/${plugin.authorName}`} className="text-blue-400 font-bold hover:underline">
                          {plugin.authorName}
                        </Link>
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 text-[10px] font-bold border border-blue-500/20 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          <span>Verified Creator (70% Split)</span>
                        </span>
                      </div>

                      {/* Co-Authors Team */}
                      <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                        <Users className="w-3.5 h-3.5 text-purple-400" />
                        <span>Co-Author / Art:</span>
                        <Link to="/users/PixelCraft_Art" className="text-purple-300 font-bold hover:underline">
                          PixelCraft_Art
                        </Link>
                        <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 text-[10px] font-mono border border-purple-500/20">
                          30% Revenue Share
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-emerald-400">
                      {formatPrice(plugin.price)}
                    </span>
                  </div>
                </div>

                {/* Metrics bar */}
                <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/5 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <strong className="text-white text-sm">{plugin.rating}</strong>
                    <span className="text-slate-400">({plugin.reviewsCount || 12} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-blue-400" />
                    <strong className="text-white text-sm">{(plugin.downloads || 284).toLocaleString()}</strong>
                    <span className="text-slate-400">downloads</span>
                  </div>
                  <MinoShieldBadge />
                </div>
              </div>
            </div>

            {/* Multi-Tab Documentation & BuiltByBit Suite Hub */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl p-6 md:p-8">
              
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 pb-6 border-b border-white/10">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'reviews', label: `⭐ Reviews & Ratings (${pluginReviews.length})` },
                  { id: 'dependencies', label: '📦 Dependencies & Hooks' },
                  { id: 'compatibility', label: '🎮 Compatibility Matrix' },
                  { id: 'screenshots', label: '📸 In-Game Visuals' },
                  { id: 'changelog', label: '📜 Changelog & Version Archive' },
                  { id: 'commands', label: 'Commands & Perms' },
                  { id: 'config', label: 'Sample Config' },
                  { id: 'minoshield', label: '🛡️ MinoShield™ Scan' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="pt-6">
                {activeTab === 'overview' && (
                  <div 
                    className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: plugin.overview || plugin.summary }}
                  />
                )}

                {/* ⭐ Buyer Reviews & Seller Rating Tab (.1 Precision) */}
                {activeTab === 'reviews' && (
                  <div className="space-y-8 animate-fade-in">
                    {/* Header score card */}
                    <div className="p-6 bg-slate-950/90 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                      <div className="flex items-center gap-4 text-center sm:text-left">
                        <div className="text-4xl font-black text-amber-400 font-mono">
                          {Number(plugin.rating || 5.0).toFixed(1)}
                        </div>
                        <div>
                          <StarRating rating={plugin.rating || 5.0} size="lg" showValue={false} />
                          <p className="text-xs text-slate-400 mt-1">
                            Based on {pluginReviews.length} verified buyer reviews
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 px-3.5 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-300 text-xs font-bold">
                        <ShieldCheck className="w-4 h-4 text-blue-400" />
                        <span>100% Authentic Verified Purchases Only</span>
                      </div>
                    </div>

                    {/* Write Review Form or Verified Guard Banner */}
                    {canUserReview || isFree ? (
                      <div className="p-6 bg-slate-950/60 border border-white/10 rounded-2xl space-y-4">
                        <div className="flex items-center gap-2 text-sm font-black text-white">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span>Leave a Verified Review for this Plugin Seller</span>
                        </div>

                        <form onSubmit={handlePostPluginReview} className="space-y-4">
                          {/* Rating Slider */}
                          <div className="p-4 bg-slate-900/80 rounded-xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                              Your Rating (1.0 - 5.0)
                            </label>
                            <div className="flex items-center gap-3">
                              <StarRating 
                                rating={reviewRating} 
                                size="lg" 
                                interactive={true} 
                                onChange={(val) => setReviewRating(val)}
                              />
                            </div>
                          </div>

                          {/* Review Title */}
                          <div>
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                              Review Title
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Excellent discord bot, works right out of the box!"
                              value={reviewTitle}
                              onChange={(e) => setReviewTitle(e.target.value)}
                              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                            />
                          </div>

                          {/* Review Message */}
                          <div>
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                              Detailed Feedback Message *
                            </label>
                            <textarea
                              rows="3"
                              required
                              placeholder="Share details about performance, configuration ease, support, and reliability..."
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                            />
                          </div>

                          {reviewStatus.message && (
                            <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                              reviewStatus.type === 'success' 
                                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
                                : 'bg-red-500/10 border border-red-500/30 text-red-400'
                            }`}>
                              {reviewStatus.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                              <span>{reviewStatus.message}</span>
                            </div>
                          )}

                          <div className="flex justify-end">
                            <button
                              type="submit"
                              disabled={reviewSubmitting}
                              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50"
                            >
                              {reviewSubmitting ? 'Verifying & Posting...' : 'Publish Verified Review'}
                            </button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      <div className="p-6 bg-slate-950/80 border border-amber-500/20 rounded-2xl flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                          <Lock className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-white">🔒 Verified Purchase Required</h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            To ensure 100% authentic ratings, only buyers who have purchased or downloaded this resource can publish a review.
                          </p>
                        </div>
                        <button
                          onClick={() => addToCart(plugin)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold whitespace-nowrap shadow cursor-pointer"
                        >
                          Buy Resource to Review
                        </button>
                      </div>
                    )}

                    {/* Existing Reviews List */}
                    <div className="space-y-4 pt-2">
                      <h4 className="font-black text-xs uppercase tracking-wider text-slate-400">
                        Recent Buyer Feedback ({pluginReviews.length})
                      </h4>

                      {pluginReviews.length === 0 ? (
                        <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-white/5 text-slate-500 text-xs">
                          No reviews submitted for this resource yet. Be the first verified buyer to leave feedback!
                        </div>
                      ) : (
                        pluginReviews.map((rev) => (
                          <div key={rev.id} className="p-5 bg-slate-950/80 border border-white/10 rounded-2xl space-y-3 shadow-lg">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-xs text-amber-300">
                                  {rev.username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-xs text-white">{rev.username}</span>
                                    {rev.isUltimate && <span className="text-[10px] text-amber-400 font-black">👑</span>}
                                    <span className="px-1.5 py-0.2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold rounded">
                                      ✓ Verified Buyer
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </span>
                                </div>
                              </div>
                              <StarRating rating={rev.rating} size="sm" showValue={true} />
                            </div>

                            <h5 className="font-bold text-white text-xs">"{rev.title}"</h5>
                            <p className="text-slate-300 text-xs leading-relaxed italic">"{rev.comment}"</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Compatibility Matrix Tab */}
                {activeTab === 'compatibility' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-cyan-400" />
                        <span>Platform Compatibility &amp; Requirements</span>
                      </h3>
                      <p className="text-xs text-slate-400">Verified tested runtime environments for this resource.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Game Versions */}
                      <div className="p-4 bg-slate-950 rounded-2xl border border-white/10 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase">
                          <Layers className="w-4 h-4" />
                          <span>Tested Game Versions</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {['1.8.8', '1.12.2', '1.16.5', '1.18.2', '1.20.4', '1.21.x'].map(v => (
                            <span key={v} className="px-2.5 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-lg text-xs font-mono font-bold">
                              ✓ {v}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Server Software */}
                      <div className="p-4 bg-slate-950 rounded-2xl border border-white/10 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase">
                          <Cpu className="w-4 h-4" />
                          <span>Server Engines</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {['Paper', 'Purpur', 'Velocity', 'Folia', 'BungeeCord', 'Spigot'].map(s => (
                            <span key={s} className="px-2.5 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-lg text-xs font-semibold">
                              ✓ {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Java Runtime */}
                      <div className="p-4 bg-slate-950 rounded-2xl border border-white/10 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase">
                          <Zap className="w-4 h-4" />
                          <span>Java Runtimes</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {['Java 17 (LTS)', 'Java 21 (Recommended)', 'Java 8+'].map(j => (
                            <span key={j} className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-lg text-xs font-semibold">
                              ✓ {j}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dependencies & Hooks Tab */}
                {activeTab === 'dependencies' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <PackageCheck className="w-5 h-5 text-emerald-400" />
                        <span>Resource Dependencies &amp; Plugin Hooks</span>
                      </h3>
                      <p className="text-xs text-slate-400">Prerequisites and optional soft-dependencies for optimal performance.</p>
                    </div>

                    <div className="space-y-4">
                      {/* Required Core Dependencies */}
                      <div className="p-5 rounded-2xl bg-slate-950 border border-red-500/30 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wide">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Required Core Dependencies (Must Install)</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          <div className="p-3.5 bg-slate-900/80 border border-white/10 rounded-xl flex items-center justify-between">
                            <div>
                              <strong className="text-xs font-bold text-white block">Vault (Core API)</strong>
                              <span className="text-[11px] text-slate-400">v1.7.3 or newer</span>
                            </div>
                            <a
                              href="https://www.spigotmc.org/resources/vault.34315/"
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-xs font-bold border border-blue-500/30 flex items-center gap-1"
                            >
                              <span>Get Vault</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>

                          <div className="p-3.5 bg-slate-900/80 border border-white/10 rounded-xl flex items-center justify-between">
                            <div>
                              <strong className="text-xs font-bold text-white block">ProtocolLib</strong>
                              <span className="text-[11px] text-slate-400">v5.3+ (Packet Manager)</span>
                            </div>
                            <a
                              href="https://www.spigotmc.org/resources/protocollib.1997/"
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-xs font-bold border border-blue-500/30 flex items-center gap-1"
                            >
                              <span>Get ProtocolLib</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Optional Soft Hooks */}
                      <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wide">
                          <GitFork className="w-4 h-4" />
                          <span>Optional Supported Integrations &amp; Hooks</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          <div className="p-3.5 bg-slate-900/80 border border-white/10 rounded-xl flex items-center justify-between">
                            <div>
                              <strong className="text-xs font-bold text-white block">PlaceholderAPI (PAPI)</strong>
                              <span className="text-[11px] text-emerald-400 font-medium">✓ 15+ Custom Placeholders</span>
                            </div>
                            <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-300 text-[10px] font-bold rounded">Supported</span>
                          </div>

                          <div className="p-3.5 bg-slate-900/80 border border-white/10 rounded-xl flex items-center justify-between">
                            <div>
                              <strong className="text-xs font-bold text-white block">DiscordSRV</strong>
                              <span className="text-[11px] text-emerald-400 font-medium">✓ Live Discord Sync</span>
                            </div>
                            <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-300 text-[10px] font-bold rounded">Supported</span>
                          </div>

                          <div className="p-3.5 bg-slate-900/80 border border-white/10 rounded-xl flex items-center justify-between">
                            <div>
                              <strong className="text-xs font-bold text-white block">WorldGuard &amp; WorldEdit</strong>
                              <span className="text-[11px] text-emerald-400 font-medium">✓ Region Bank Flag Protection</span>
                            </div>
                            <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-300 text-[10px] font-bold rounded">Supported</span>
                          </div>

                          <div className="p-3.5 bg-slate-900/80 border border-white/10 rounded-xl flex items-center justify-between">
                            <div>
                              <strong className="text-xs font-bold text-white block">LuckPerms</strong>
                              <span className="text-[11px] text-emerald-400 font-medium">✓ Dynamic Permission Groups</span>
                            </div>
                            <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-300 text-[10px] font-bold rounded">Supported</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Changelog & Legacy Version Archive Tab */}
                {activeTab === 'changelog' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <History className="w-5 h-5 text-purple-400" />
                        <span>Release History &amp; Legacy Version Archive</span>
                      </h3>
                      <p className="text-xs text-slate-400">Download current builds or rollback to legacy server versions.</p>
                    </div>

                    {/* Version Download Table */}
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-900 text-slate-400 font-bold border-b border-white/10">
                          <tr>
                            <th className="p-3.5">Version</th>
                            <th className="p-3.5">Target Game</th>
                            <th className="p-3.5">Release Date</th>
                            <th className="p-3.5">Size</th>
                            <th className="p-3.5 text-right">Archive Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-300">
                          <tr className="hover:bg-white/5 transition-colors">
                            <td className="p-3.5 font-bold font-mono text-cyan-300 flex items-center gap-1.5">
                              <span>v2.4.0</span>
                              <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 text-[9px] uppercase rounded">Latest</span>
                            </td>
                            <td className="p-3.5 text-white font-medium">Minecraft 1.20.4 - 1.21.x</td>
                            <td className="p-3.5 text-slate-400">2 days ago</td>
                            <td className="p-3.5 font-mono">4.2 MB</td>
                            <td className="p-3.5 text-right">
                              <button 
                                onClick={handleDownload}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Download className="w-3 h-3" />
                                <span>Download</span>
                              </button>
                            </td>
                          </tr>

                          <tr className="hover:bg-white/5 transition-colors">
                            <td className="p-3.5 font-bold font-mono text-white">v2.3.0</td>
                            <td className="p-3.5 text-white font-medium">Minecraft 1.20.1 - 1.20.4</td>
                            <td className="p-3.5 text-slate-400">3 weeks ago</td>
                            <td className="p-3.5 font-mono">3.9 MB</td>
                            <td className="p-3.5 text-right">
                              <button 
                                onClick={handleDownload}
                                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold text-xs inline-flex items-center gap-1 cursor-pointer border border-white/10"
                              >
                                <Download className="w-3 h-3" />
                                <span>Rollback .zip</span>
                              </button>
                            </td>
                          </tr>

                          <tr className="hover:bg-white/5 transition-colors">
                            <td className="p-3.5 font-bold font-mono text-white">v2.0.0</td>
                            <td className="p-3.5 text-white font-medium">Minecraft 1.18.2 - 1.19.4</td>
                            <td className="p-3.5 text-slate-400">2 months ago</td>
                            <td className="p-3.5 font-mono">3.5 MB</td>
                            <td className="p-3.5 text-right">
                              <button 
                                onClick={handleDownload}
                                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold text-xs inline-flex items-center gap-1 cursor-pointer border border-white/10"
                              >
                                <Download className="w-3 h-3" />
                                <span>Rollback .zip</span>
                              </button>
                            </td>
                          </tr>

                          <tr className="hover:bg-white/5 transition-colors">
                            <td className="p-3.5 font-bold font-mono text-amber-300">v1.5.0 (Legacy)</td>
                            <td className="p-3.5 text-white font-medium">Minecraft 1.8.8 - 1.12.2</td>
                            <td className="p-3.5 text-slate-400">6 months ago</td>
                            <td className="p-3.5 font-mono">2.8 MB</td>
                            <td className="p-3.5 text-right">
                              <button 
                                onClick={handleDownload}
                                className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg font-bold text-xs inline-flex items-center gap-1 cursor-pointer border border-amber-500/30"
                              >
                                <FileArchive className="w-3 h-3" />
                                <span>Legacy 1.12</span>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Changelog Notes */}
                    <div className="space-y-4 pt-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase">Detailed Patch Notes</h4>
                      
                      {/* Latest Release */}
                      <div className="p-5 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-white font-mono">{plugin.version || 'v2.4.0'}</span>
                            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase">
                              Latest Stable
                            </span>
                          </div>
                          <span className="text-xs text-slate-400">Released 2 days ago</span>
                        </div>
                        <ul className="space-y-2 text-xs text-slate-300">
                          <li className="flex items-start gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">FEATURE</span>
                            <span>Added multi-vault 54-slot ATM visual banking GUI with 4-digit PIN lock.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-mono font-bold">OPTIMIZE</span>
                            <span>Refactored async MySQL connection pool for Folia multi-threaded regions.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold">BUGFIX</span>
                            <span>Fixed decimal rounding discrepancy during cross-proxy server transfers.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* MinoShield Security Report Tab */}
                {activeTab === 'minoshield' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        <span>MinoShield™ Decompilation &amp; Malware Report</span>
                      </h3>
                      <p className="text-xs text-slate-400">Automated static bytecode analysis &amp; security verification.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-950 rounded-2xl border border-emerald-500/30 space-y-2">
                        <span className="text-xs text-slate-400 font-bold uppercase">VirusTotal &amp; Signatures</span>
                        <div className="text-2xl font-black text-emerald-400">0 / 70 Clean</div>
                        <p className="text-[11px] text-slate-400">Zero malicious class injections or backdoors detected.</p>
                      </div>

                      <div className="p-4 bg-slate-950 rounded-2xl border border-white/10 space-y-2">
                        <span className="text-xs text-slate-400 font-bold uppercase">Bytecode Integrity</span>
                        <div className="text-sm font-mono text-cyan-300 truncate">SHA256: 8f9b4c1... verified</div>
                        <p className="text-[11px] text-emerald-400 font-semibold">✓ Package matches author original build</p>
                      </div>
                    </div>

                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-xs text-slate-300 space-y-2">
                      <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" />
                        <span>MinoForge Security Guarantee</span>
                      </h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Every resource uploaded to MinoForge passes through our automated bytecode decompilation pipeline to ensure zero forced OP commands, unauthorized token stealers, or external webhooks.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'screenshots' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-400">
                      Real in-game GUI screenshots and feature showcases uploaded by the author:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(plugin.screenshots || [plugin.coverImageUrl]).map((img, idx) => (
                        <div key={idx} className="group relative rounded-2xl overflow-hidden border border-white/10 bg-slate-950 shadow-xl">
                          <img 
                            src={img} 
                            alt={`${plugin.title} preview ${idx + 1}`} 
                            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'commands' && (
                  <div 
                    className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: plugin.commands || '<p>No custom commands required.</p>' }}
                  />
                )}

                {activeTab === 'config' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">Default Configuration</span>
                      <Link
                        to="/ai-config"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-bold rounded-lg border border-blue-500/30 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Customize with AI</span>
                      </Link>
                    </div>
                    <pre className="p-4 rounded-2xl bg-slate-950 border border-white/10 font-mono text-xs text-blue-200 overflow-x-auto">
                      {plugin.configSample}
                    </pre>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            
            {/* Purchase / Download Card */}
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl sticky top-24 space-y-4">
              
              {/* User License Key (If previously purchased) */}
              {userLicense && (
                <div className="p-3.5 bg-slate-950 border border-cyan-500/30 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-cyan-300 flex items-center gap-1">
                      <Key className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Your Active License</span>
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(userLicense.licenseKey);
                        setCopiedLic(true);
                        setTimeout(() => setCopiedLic(false), 2000);
                      }}
                      className="text-xs text-slate-400 hover:text-cyan-300 cursor-pointer"
                    >
                      {copiedLic ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="font-mono text-xs font-bold text-emerald-400 select-all truncate">
                    {userLicense.licenseKey}
                  </div>
                </div>
              )}

              {/* Primary Action Button */}
              {!isFree ? (
                <div className="space-y-2.5">
                  <button 
                    onClick={() => {
                      if (!user) {
                        navigate(`/login?redirect=/plugins/${id}`);
                        return;
                      }
                      addToCart(plugin, false);
                      openCheckoutWithMethod('applepay');
                    }}
                    className="btn-glow-blue btn-shimmer btn-animated w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-500 hover:via-cyan-400 hover:to-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Instant Checkout ({formatPrice(plugin.price)})</span>
                  </button>

                  {/* 4 Express Fast Pay Options */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Apple Pay Button */}
                    <button 
                      onClick={() => {
                        if (!user) {
                          navigate(`/login?redirect=/plugins/${id}`);
                          return;
                        }
                        addToCart(plugin, false);
                        openCheckoutWithMethod('applepay');
                      }}
                      className="py-2.5 px-3 bg-black hover:bg-neutral-900 active:scale-[0.99] text-white font-black rounded-xl shadow-md border border-white/20 transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer"
                    >
                      <span>Pay with</span>
                      <span className="font-bold text-sm tracking-tight flex items-center">
                        <span></span><span>Pay</span>
                      </span>
                    </button>

                    {/* Google Pay Button */}
                    <button 
                      onClick={() => {
                        if (!user) {
                          navigate(`/login?redirect=/plugins/${id}`);
                          return;
                        }
                        addToCart(plugin, false);
                        openCheckoutWithMethod('googlepay');
                      }}
                      className="py-2.5 px-3 bg-slate-950 hover:bg-slate-900 active:scale-[0.99] text-white font-black rounded-xl shadow-md border border-white/15 transition-all flex items-center justify-center gap-1 text-xs cursor-pointer"
                    >
                      <span>Pay with</span>
                      <span className="font-bold text-xs tracking-tight flex items-center">
                        <span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">P</span><span className="text-[#FBBC05]">a</span><span className="text-[#34A853]">y</span>
                      </span>
                    </button>

                    {/* PayPal Button */}
                    <button 
                      onClick={() => {
                        if (!user) {
                          navigate(`/login?redirect=/plugins/${id}`);
                          return;
                        }
                        addToCart(plugin, false);
                        openCheckoutWithMethod('paypal');
                      }}
                      className="py-2.5 px-3 bg-[#ffc439] hover:bg-[#f4b628] active:scale-[0.99] text-[#003087] font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-1 text-xs cursor-pointer"
                    >
                      <span>Pay with</span>
                      <span className="font-black text-xs tracking-tight italic">
                        <span className="text-[#003087]">Pay</span><span className="text-[#0079C1]">Pal</span>
                      </span>
                    </button>

                    {/* iDEAL Button */}
                    <button 
                      onClick={() => {
                        if (!user) {
                          navigate(`/login?redirect=/plugins/${id}`);
                          return;
                        }
                        addToCart(plugin, false);
                        openCheckoutWithMethod('ideal');
                      }}
                      className="py-2.5 px-3 bg-[#cc0066] hover:bg-[#b30059] active:scale-[0.99] text-white font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-1 text-xs cursor-pointer"
                    >
                      <span>Pay with</span>
                      <span className="font-black text-[11px] tracking-tight uppercase bg-white text-[#cc0066] px-1 py-0.2 rounded font-mono">
                        iDEAL
                      </span>
                    </button>
                  </div>

                  <button 
                    onClick={() => handlePurchaseOrAddToCart(true)}
                    className="btn-animated w-full py-2.5 px-6 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4 text-cyan-400" />
                    <span>{isInCart(plugin.id) ? 'In Cart • View Cart' : 'Add to Shopping Cart'}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <button 
                    onClick={handleDownload}
                    className="btn-glow-blue btn-shimmer btn-animated w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black rounded-2xl shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
                  >
                    {downloadSuccess ? <Check className="w-5 h-5 text-white" /> : <Download className="w-5 h-5" />}
                    <span>{downloadSuccess ? 'Downloaded!' : 'Download Free Package (.zip)'}</span>
                  </button>

                  <button 
                    onClick={() => handlePurchaseOrAddToCart(true)}
                    className="btn-animated w-full py-2.5 px-6 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4 text-emerald-400" />
                    <span>{isInCart(plugin.id) ? 'In Cart • View Cart' : 'Add Free Item to Cart'}</span>
                  </button>
                </div>
              )}

              {/* Direct 1-on-1 Chat with Creator for Support / Refund Button */}
              <Link
                to={`/chats?creator=${plugin.authorName || 'MinoDeveloper'}&plugin=${encodeURIComponent(plugin.title)}`}
                className="w-full py-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 hover:border-purple-500/50 text-purple-200 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all group cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                <span>Chat with Owner (Support &amp; Refunds)</span>
              </Link>

              {/* Watch Resource Updates Button */}
              <button
                onClick={toggleWatch}
                className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isWatched
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                {isWatched ? (
                  <>
                    <BellOff className="w-4 h-4 text-amber-400" />
                    <span>Watching (Pings Enabled)</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4 text-slate-400" />
                    <span>Watch Resource (Get Update Alerts)</span>
                  </>
                )}
              </button>

              {/* Details table */}
              <div className="space-y-3 pt-4 border-t border-white/5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Updated</span>
                  <strong className="text-white">{plugin.lastUpdated}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Version</span>
                  <strong className="font-mono text-white">{plugin.version}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Category</span>
                  <strong className="text-blue-400">{plugin.gameName || plugin.game}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Security</span>
                  <strong className="text-emerald-400 font-bold">MinoShield Verified</strong>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default PluginDetailPage;
