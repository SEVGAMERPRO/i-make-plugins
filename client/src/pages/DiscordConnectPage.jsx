import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bot, CheckCircle2, ShieldCheck, Zap, Copy, Check, ChevronRight, ExternalLink, RefreshCw, Sparkles, Terminal, Code, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DiscordConnectPage = () => {
  const { user } = useAuth();
  const [discordUser, setDiscordUser] = useState(() => {
    try {
      const saved = localStorage.getItem('minoforge_discord_link');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [connecting, setConnecting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleSimulateDiscordConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      const mockDiscord = {
        id: '928374829102938475',
        username: user ? `${user.username.toLowerCase()}#0001` : 'MinoCustomer#1337',
        displayName: user?.username || 'MinoCustomer',
        avatarUrl: '/favicon.svg',
        linkedAt: new Date().toLocaleDateString(),
        syncedRoles: ['Verified Buyer', 'MinoForge Member', 'Customer - UltimateEconomy']
      };
      setDiscordUser(mockDiscord);
      localStorage.setItem('minoforge_discord_link', JSON.stringify(mockDiscord));
      setConnecting(false);
    }, 1200);
  };

  const handleDisconnect = () => {
    setDiscordUser(null);
    localStorage.removeItem('minoforge_discord_link');
  };

  const botCodeSnippet = `// MinoForge Discord Customer Role & Sales Bot (bot.js)
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const express = require('express');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages
  ]
});

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.DISCORD_GUILD_ID;
const CUSTOMER_ROLE_ID = process.env.DISCORD_CUSTOMER_ROLE_ID;

client.once('ready', () => {
  console.log(\`✅ MinoForge Bot online as \${client.user.tag}!\`);
});

// Express Webhook Receiver for MinoForge Purchases
const app = express();
app.use(express.json());

app.post('/webhook/purchase', async (req, res) => {
  const { buyerUsername, discordId, pluginTitle, transactionId, amount } = req.body;

  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    if (discordId) {
      const member = await guild.members.fetch(discordId);
      if (member) {
        await member.roles.add(CUSTOMER_ROLE_ID);
        console.log(\`Granted Customer Role to \${member.user.tag} for \${pluginTitle}\`);
      }
    }

    // Send announcement to #sales channel
    const salesChannel = guild.channels.cache.find(c => c.name === 'sales-log');
    if (salesChannel) {
      const embed = new EmbedBuilder()
        .setColor(0x38bdf8)
        .setTitle('🎉 New Marketplace Purchase!')
        .setDescription(\`**\${buyerUsername}** just purchased **\${pluginTitle}**!\`)
        .addFields(
          { name: 'Order ID', value: \`#\${transactionId}\`, inline: true },
          { name: 'Price', value: \`$\${amount} USD\`, inline: true }
        )
        .setTimestamp();
      salesChannel.send({ embeds: [embed] });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log('MinoForge Webhook Server running on :3001'));
client.login(BOT_TOKEN);
`;

  return (
    <div className="bg-[#0b0f19] min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-blue-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white font-medium">Discord Integration Center</span>
        </div>

        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center text-[#5865F2]">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Discord Integration Hub</h1>
                <p className="text-xs text-slate-400">Connect your account for automated customer roles and creator webhooks.</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>OAuth2 Ready</span>
            </span>
          </div>
        </div>

        {/* Section 1: User Account Connection Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl space-y-6">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-400" />
            <span>Your Discord Account Link</span>
          </h2>

          {discordUser ? (
            <div className="p-6 rounded-2xl bg-slate-950 border border-[#5865F2]/40 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#5865F2]/20 border border-[#5865F2]/50 p-2 flex items-center justify-center">
                    <Bot className="w-8 h-8 text-[#5865F2]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-base font-black text-white">{discordUser.displayName}</strong>
                      <span className="text-xs font-mono text-slate-400">({discordUser.username})</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 block">Discord ID: {discordUser.id}</span>
                    <span className="text-[11px] text-emerald-400 font-semibold">✓ Linked on {discordUser.linkedAt}</span>
                  </div>
                </div>

                <button
                  onClick={handleDisconnect}
                  className="px-4 py-2 bg-slate-900 hover:bg-red-500/20 text-slate-300 hover:text-red-300 border border-white/10 hover:border-red-500/30 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Disconnect Account
                </button>
              </div>

              {/* Synced Roles Badges */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Automatically Synced Server Roles:
                </span>
                <div className="flex flex-wrap gap-2">
                  {discordUser.syncedRoles.map((role, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-[#5865F2]/20 text-[#8ea1e1] border border-[#5865F2]/30 rounded-lg text-xs font-bold font-mono"
                    >
                      @{role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <strong className="text-sm font-bold text-white block">No Discord Account Connected</strong>
                <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
                  Link your Discord account to automatically claim your <span className="text-indigo-300 font-semibold">@Verified Buyer</span> role and gain direct access to private resource support channels.
                </p>
              </div>

              <button
                onClick={handleSimulateDiscordConnect}
                disabled={connecting}
                className="px-6 py-3.5 bg-[#5865F2] hover:bg-[#4752c4] text-white font-black text-xs rounded-xl shadow-lg shadow-[#5865F2]/25 flex items-center justify-center gap-2 transition-all cursor-pointer flex-shrink-0"
              >
                <Bot className="w-4 h-4" />
                <span>{connecting ? 'Linking Discord...' : 'Connect with Discord'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Section 2: Complete Developer Bot Setup Guide */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl space-y-6">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Code className="w-5 h-5 text-cyan-400" />
              <span>How to Create &amp; Setup Your Own Discord Bot (Creator Guide)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Follow these simple steps to set up automated purchase announcements and instant customer role assignment in your Discord server.
            </p>
          </div>

          {/* Guide Steps Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs font-mono">1</span>
                <span>Create Discord Application</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Go to the <a href="https://discord.com/developers/applications" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline font-bold inline-flex items-center gap-1">Discord Developer Portal <ExternalLink className="w-3 h-3" /></a>, click <strong>"New Application"</strong>, and name it <em>"MinoForge Bot"</em>.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs font-mono">2</span>
                <span>Get Bot Token &amp; Intents</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Navigate to the <strong>Bot</strong> tab, click <strong>"Reset Token"</strong>, copy your bot token, and enable <strong>"Server Members Intent"</strong> and <strong>"Message Content Intent"</strong>.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs font-mono">3</span>
                <span>Invite Bot with Manage Roles</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Under <strong>OAuth2 → URL Generator</strong>, select the <code className="bg-slate-900 px-1 rounded text-cyan-300">bot</code> scope and permissions: <em>Manage Roles, Send Messages, Embed Links</em>. Open the invite link to add it to your server.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs font-mono">4</span>
                <span>Set Bot Role Hierarchy</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                In your Discord Server Settings → Roles, make sure the <strong>MinoForge Bot role</strong> is dragged <em>ABOVE</em> the <strong>@Customer</strong> role so it has permission to assign it to buyers.
              </p>
            </div>

          </div>

          {/* Node.js Bot Code Snippet Box */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Ready-to-Use Discord.js Bot Source Code (bot.js)</span>
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(botCodeSnippet);
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg border border-white/10 flex items-center gap-1.5 cursor-pointer transition-all"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied Code' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="p-5 rounded-2xl bg-slate-950 border border-white/10 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
              {botCodeSnippet}
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DiscordConnectPage;
