import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ShieldCheck, CheckCircle2, Clock, XCircle, Search, Filter, Send, Download, Sparkles, User, AlertTriangle, FileText, ArrowRight, CornerDownRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const INITIAL_TICKETS = [
  {
    id: 'TICK-8902',
    user: 'CyberGamer_99',
    category: 'Minecraft Plugins',
    subject: 'Ultimate Economy: Multi-Vault SQLite sync issue on Paper 1.21',
    priority: 'HIGH',
    status: 'OPEN',
    createdAt: '15 mins ago',
    messages: [
      { sender: 'user', name: 'CyberGamer_99', time: '15 mins ago', text: 'Hey staff! When I try to create a secondary vault on Paper 1.21.1 with SQLite, it gives a pool connection warning. How do I fix this?' },
      { sender: 'system', name: 'MinoShield Bot', time: '14 mins ago', text: 'Ticket opened. Support staff @Alex has been notified.' }
    ]
  },
  {
    id: 'TICK-8901',
    user: 'NordicRP_Owner',
    category: 'FiveM Scripts',
    subject: 'Advanced Fuel: Custom electric vehicle model whitelist question',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    createdAt: '1 hour ago',
    messages: [
      { sender: 'user', name: 'NordicRP_Owner', time: '1 hour ago', text: 'How do I add custom modded electric car spawn names to config.lua?' },
      { sender: 'staff', name: 'MinoAdmin', time: '45 mins ago', text: 'Hi NordicRP! Simply open config.lua and append your spawn code to Config.ElectricVehicles array (e.g. "teslaplaid").' }
    ]
  },
  {
    id: 'TICK-8899',
    user: 'RedstoneCrafter',
    category: 'Multi-Account IP Appeal',
    subject: 'IP Conflict Warning Appeal: My brother and I share the same home Wi-Fi',
    priority: 'URGENT',
    status: 'OPEN',
    createdAt: '3 hours ago',
    messages: [
      { sender: 'user', name: 'RedstoneCrafter', time: '3 hours ago', text: 'We got the 20-day suspension warning because my brother created an account from our shared router. Can we get an IP family exemption?' },
      { sender: 'system', name: 'MinoShield IP Radar', time: '3 hours ago', text: 'IP Conflict Flag: 192.168.1.1 (2 accounts detected).' }
    ]
  },
  {
    id: 'TICK-8895',
    user: 'VortexHosting',
    category: 'Discord Bot',
    subject: 'Discord Ticket Bot: Self-hosted HTML transcript logs setup',
    priority: 'LOW',
    status: 'RESOLVED',
    createdAt: 'Yesterday',
    messages: [
      { sender: 'user', name: 'VortexHosting', time: 'Yesterday', text: 'Thanks for the bot! The 1-click install.bat worked smoothly.' },
      { sender: 'staff', name: 'MinoAdmin', time: 'Yesterday', text: 'Glad to hear! Let us know if you need any custom features added.' }
    ]
  }
];

const StaffTicketsPage = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [selectedTicketId, setSelectedTicketId] = useState('TICK-8902');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [replyText, setReplyText] = useState('');
  const [exportedSuccess, setExportedSuccess] = useState(false);

  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0];

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const newMsg = {
      sender: 'staff',
      name: user?.username || 'MinoAdmin',
      time: 'Just now',
      text: replyText.trim()
    };

    setTickets(prev => prev.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: t.status === 'OPEN' ? 'IN_PROGRESS' : t.status,
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    }));

    setReplyText('');
  };

  const handleUpdateStatus = (newStatus) => {
    if (!selectedTicket) return;
    setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, status: newStatus } : t));
  };

  const handleExportTranscript = () => {
    if (!selectedTicket) return;
    const transcriptHtml = `<!DOCTYPE html>
<html>
<head><title>Transcript ${selectedTicket.id}</title><style>body{font-family:sans-serif;background:#0f172a;color:#fff;padding:24px;} .msg{margin-bottom:12px;padding:12px;border-radius:8px;background:#1e293b;} .staff{border-left:4px solid #38bdf8;} .user{border-left:4px solid #4ade80;}</style></head>
<body>
<h1>MinoForge Support Transcript: ${selectedTicket.id}</h1>
<p><strong>Subject:</strong> ${selectedTicket.subject}</p>
<p><strong>User:</strong> ${selectedTicket.user} | <strong>Category:</strong> ${selectedTicket.category}</p>
<hr/>
${selectedTicket.messages.map(m => `<div class="msg ${m.sender}"><strong>${m.name}</strong> (${m.time}):<br/>${m.text}</div>`).join('')}
</body></html>`;

    const blob = new Blob([transcriptHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${selectedTicket.id}.html`;
    a.click();

    setExportedSuccess(true);
    setTimeout(() => setExportedSuccess(false), 2500);
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white">Staff Support Desk &amp; Ticket Center</h1>
                <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold text-[10px] rounded-full">
                  LIVE DESK
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Logged in as <strong>{user?.username || 'MinoAdmin'}</strong> (Role: <span className="text-blue-400 font-bold">{user?.role || 'ADMIN'}</span>)
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-slate-950 border border-white/10 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Open Tickets</span>
              <strong className="text-amber-400 font-mono text-sm">
                {tickets.filter(t => t.status === 'OPEN').length}
              </strong>
            </div>
            <div className="px-4 py-2 bg-slate-950 border border-white/10 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">In Progress</span>
              <strong className="text-cyan-400 font-mono text-sm">
                {tickets.filter(t => t.status === 'IN_PROGRESS').length}
              </strong>
            </div>
            <div className="px-4 py-2 bg-slate-950 border border-white/10 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Resolved</span>
              <strong className="text-emerald-400 font-mono text-sm">
                {tickets.filter(t => t.status === 'RESOLVED').length}
              </strong>
            </div>
          </div>
        </div>

        {/* Main 2-Column Split: Ticket List (Left) & Active Chat (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Tickets Queue (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl space-y-4">
            
            {/* Search and Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by ticket ID, user, or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                      filterStatus === st
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-slate-950/80 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Ticket Cards List */}
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredTickets.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No tickets found matching this filter.
                </div>
              ) : (
                filteredTickets.map((ticket) => {
                  const isSelected = ticket.id === selectedTicketId;
                  return (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-2 ${
                        isSelected
                          ? 'bg-blue-600/15 border-cyan-400 shadow-lg shadow-cyan-500/10'
                          : 'bg-slate-950/70 border-white/5 hover:border-white/20 hover:bg-slate-950'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-black text-cyan-400">{ticket.id}</span>
                          <span className="text-[10px] text-slate-400">• {ticket.createdAt}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wider ${
                          ticket.status === 'OPEN' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          ticket.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-cyan-300 border border-cyan-500/30' :
                          'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                      </div>

                      <h4 className="font-bold text-white text-xs line-clamp-1">{ticket.subject}</h4>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/5">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-500" />
                          <strong className="text-slate-300">{ticket.user}</strong>
                        </span>
                        <span className="text-blue-300 font-semibold">{ticket.category}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* Right Column: Active Ticket Conversation (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col h-[740px]">
            
            {selectedTicket ? (
              <>
                {/* Active Ticket Header */}
                <div className="pb-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-black text-white">{selectedTicket.subject}</h2>
                      <span className="font-mono text-xs text-cyan-400 font-bold">[{selectedTicket.id}]</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Requested by <strong className="text-white">{selectedTicket.user}</strong> • {selectedTicket.category}
                    </p>
                  </div>

                  {/* Status Toggle & Export */}
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => handleUpdateStatus(e.target.value)}
                      className="bg-slate-950 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-bold"
                    >
                      <option value="OPEN">Mark as OPEN</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved / Closed</option>
                    </select>

                    <button
                      onClick={handleExportTranscript}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-white/10 transition-colors"
                      title="Export HTML Transcript"
                    >
                      {exportedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Messages Thread Container */}
                <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-2">
                  {selectedTicket.messages.map((msg, idx) => {
                    const isStaff = msg.sender === 'staff';
                    const isSystem = msg.sender === 'system';

                    if (isSystem) {
                      return (
                        <div key={idx} className="p-2.5 bg-slate-950/60 border border-blue-500/20 rounded-xl text-center text-xs text-blue-300 font-medium">
                          ⚡ {msg.text}
                        </div>
                      );
                    }

                    return (
                      <div
                        key={idx}
                        className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-bold text-slate-400">{msg.name}</span>
                          <span className="text-[10px] text-slate-500">{msg.time}</span>
                          {isStaff && (
                            <span className="px-1.5 py-0.2 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-[9px] font-extrabold rounded">
                              STAFF
                            </span>
                          )}
                        </div>

                        <div className={`p-4 rounded-2xl max-w-lg text-xs leading-relaxed ${
                          isStaff
                            ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-500/10'
                            : 'bg-slate-950 border border-white/10 text-slate-200 rounded-tl-none'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Reply Box */}
                <form onSubmit={handleSendReply} className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center gap-2">
                    <textarea
                      rows={2}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your official staff response or resolution steps..."
                      className="flex-1 bg-slate-950 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
                    />

                    <button
                      type="submit"
                      disabled={!replyText.trim()}
                      className="btn-glow-blue btn-animated h-full px-5 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-500 hover:via-cyan-400 hover:to-blue-500 text-white font-black text-xs rounded-2xl flex items-center justify-center gap-1.5 shadow-xl shadow-blue-500/20 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>Reply</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Press Reply to notify user and update ticket timeline</span>
                    <span className="text-emerald-400 font-medium">SSL 256-Bit Encrypted Ticket Vault</span>
                  </div>
                </form>
              </>
            ) : (
              <div className="m-auto text-center text-slate-500 text-xs">
                Select a ticket from the left queue to respond.
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default StaffTicketsPage;
