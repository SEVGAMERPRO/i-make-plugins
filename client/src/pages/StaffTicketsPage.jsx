import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ShieldCheck, CheckCircle2, Clock, XCircle, Search, Filter, Send, Download, Sparkles, User, AlertTriangle, FileText, ArrowRight, CornerDownRight, Check, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StaffTicketsPage = () => {
  const { user } = useAuth();
  
  // Real tickets only (stored in localStorage or empty)
  const [tickets, setTickets] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('minoforge_tickets') || '[]');
    } catch {
      return [];
    }
  });

  const [selectedTicketId, setSelectedTicketId] = useState(tickets[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [replyText, setReplyText] = useState('');
  const [exportedSuccess, setExportedSuccess] = useState(false);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);

  // New Ticket Form State
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('General Support');
  const [newPriority, setNewPriority] = useState('MEDIUM');
  const [newMessage, setNewMessage] = useState('');

  // Persist tickets
  useEffect(() => {
    localStorage.setItem('minoforge_tickets', JSON.stringify(tickets));
  }, [tickets]);

  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0] || null;

  const handleCreateTicket = (e) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) return;

    const newTicket = {
      id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
      user: user?.username || 'GuestUser',
      category: newCategory,
      subject: newSubject.trim(),
      priority: newPriority,
      status: 'OPEN',
      createdAt: 'Just now',
      messages: [
        {
          sender: 'user',
          name: user?.username || 'GuestUser',
          time: 'Just now',
          text: newMessage.trim()
        }
      ]
    };

    const updated = [newTicket, ...tickets];
    setTickets(updated);
    setSelectedTicketId(newTicket.id);
    setIsNewTicketOpen(false);
    setNewSubject('');
    setNewMessage('');
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const newMsg = {
      sender: user?.role === 'ADMIN' ? 'staff' : 'user',
      name: user?.username || 'User',
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
    setTimeout(() => setExportedSuccess(false), 3000);
  };

  const filteredTickets = tickets.filter(t => {
    const matchesFilter = filterStatus === 'ALL' || t.status === filterStatus;
    const matchesSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.user.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-[#0b0f19] min-h-screen text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Support &amp; Community Tickets</h1>
                <p className="text-xs text-slate-400">Real-time support inquiries and creator correspondence.</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <button
              onClick={() => setIsNewTicketOpen(true)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Ticket</span>
            </button>
          </div>
        </div>

        {/* New Ticket Modal */}
        {isNewTicketOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-white/10 p-6 sm:p-8 rounded-3xl max-w-lg w-full space-y-4 relative animate-fade-in shadow-2xl">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                <span>Open a Support Ticket</span>
              </h2>

              <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-400 uppercase mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Briefly describe your inquiry"
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-slate-200"
                    >
                      <option value="Minecraft Plugins">Minecraft Plugins</option>
                      <option value="FiveM Scripts">FiveM Scripts</option>
                      <option value="General Support">General Support</option>
                      <option value="Billing & Purchases">Billing &amp; Purchases</option>
                      <option value="Security / 2FA">Security / 2FA</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-400 uppercase mb-1">Priority</label>
                    <select
                      value={newPriority}
                      onChange={e => setNewPriority(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-slate-200"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-400 uppercase mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter full details of your request or issue..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsNewTicketOpen(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md"
                  >
                    Submit Ticket
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Empty State vs Active Ticket View */}
        {tickets.length === 0 ? (
          <div className="p-16 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-800/80 border border-white/10 mx-auto flex items-center justify-center text-slate-500">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">No Tickets Created Yet</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              There are currently zero support tickets. When a user submits an inquiry, requests support on a plugin, or asks a question, their ticket will appear here in real time.
            </p>
            <button
              onClick={() => setIsNewTicketOpen(true)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Support Ticket</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Tickets List */}
            <div className="lg:col-span-1 p-5 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-400">Tickets ({filteredTickets.length})</span>
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="bg-slate-950 text-xs border border-white/10 rounded-lg px-2 py-1 text-slate-300"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-slate-500"
              />

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {filteredTickets.map(ticket => (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      selectedTicket?.id === ticket.id
                        ? 'bg-blue-600/20 border-blue-500/50'
                        : 'bg-slate-950/60 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono font-bold text-cyan-300">{ticket.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        ticket.status === 'OPEN' ? 'bg-emerald-500/20 text-emerald-300' :
                        ticket.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white truncate">{ticket.subject}</h4>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                      <span>By @{ticket.user}</span>
                      <span>{ticket.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Chat Thread */}
            {selectedTicket && (
              <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-white/10 flex flex-col justify-between space-y-4">
                
                {/* Top Info Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-cyan-300">{selectedTicket.id}</span>
                      <h3 className="text-base font-bold text-white">{selectedTicket.subject}</h3>
                    </div>
                    <span className="text-xs text-slate-400">Category: {selectedTicket.category} • Author: @{selectedTicket.user}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportTranscript}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-white/10 flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{exportedSuccess ? 'Downloaded' : 'HTML Transcript'}</span>
                    </button>
                    <select
                      value={selectedTicket.status}
                      onChange={e => handleUpdateStatus(e.target.value)}
                      className="bg-slate-950 border border-white/10 text-xs text-cyan-300 font-bold rounded-xl px-3 py-1.5"
                    >
                      <option value="OPEN">Status: OPEN</option>
                      <option value="IN_PROGRESS">Status: IN PROGRESS</option>
                      <option value="RESOLVED">Status: RESOLVED</option>
                    </select>
                  </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 space-y-3 overflow-y-auto max-h-[400px] p-2">
                  {selectedTicket.messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl max-w-xl ${
                        m.sender === 'staff'
                          ? 'ml-auto bg-blue-600/25 border border-blue-500/40 text-blue-100'
                          : 'mr-auto bg-slate-950 border border-white/10 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 text-[11px] mb-1 text-slate-400 font-semibold">
                        <span>{m.name} {m.sender === 'staff' && '👑 (Staff)'}</span>
                        <span>{m.time}</span>
                      </div>
                      <p className="text-xs leading-relaxed">{m.text}</p>
                    </div>
                  ))}
                </div>

                {/* Send Reply Input */}
                <form onSubmit={handleSendReply} className="flex gap-2 pt-2 border-t border-white/10">
                  <input
                    type="text"
                    required
                    placeholder="Type your response..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    className="flex-1 bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default StaffTicketsPage;
