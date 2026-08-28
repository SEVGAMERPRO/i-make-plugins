import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, Clock, Download, FileCode, ArrowRight, Eye, User } from 'lucide-react';
import MinoShieldBadge from '../components/security/MinoShieldBadge';

import { useNotifications } from '../context/NotificationContext';

const PENDING_QUEUE = [
  {
    id: 'rev-101',
    title: 'Advanced Fuel & Electric Charging System',
    author: 'FiveMDev_99',
    game: 'FiveM',
    version: 'v1.0.0',
    price: '9.99',
    submittedAt: '35 minutes ago',
    fileName: 'advanced_fuel_v1.0.0.zip',
    fileSize: '4.2 MB',
    summary: 'Realistic gas stations, Jerry cans, EV charging stations, and custom UI.',
    securityScore: 100
  },
  {
    id: 'rev-102',
    title: 'Custom Boss Dungeons & Mythic Loot',
    author: 'CraftLord',
    game: 'Minecraft',
    version: 'v1.4.2',
    price: '0.00',
    submittedAt: '2 hours ago',
    fileName: 'MythicDungeons-1.4.2.jar',
    fileSize: '12.8 MB',
    summary: 'Instanced MMO-style dungeon raids with custom mob AI and particle skills.',
    securityScore: 98
  }
];

const StaffReviewPage = () => {
  const { addNotification } = useNotifications();
  const [queue, setQueue] = useState(PENDING_QUEUE);
  const [selectedPlugin, setSelectedPlugin] = useState(PENDING_QUEUE[0] || null);
  const [denialReason, setDenialReason] = useState('');
  const [showDenyModal, setShowDenyModal] = useState(false);

  const handleApprove = (id) => {
    const remaining = queue.filter(p => p.id !== id);
    setQueue(remaining);
    setSelectedPlugin(remaining[0] || null);
  };

  const handleDeny = () => {
    if (!denialReason.trim()) return;
    const pluginTitle = selectedPlugin ? selectedPlugin.title : 'Plugin';
    
    addNotification({
      title: `Plugin Denied: Changes Required`,
      message: `"${pluginTitle}" was reviewed. Staff reason: "${denialReason}"`,
      type: 'denied',
      link: '/dashboard'
    });

    const remaining = queue.filter(p => p.id !== selectedPlugin.id);
    setQueue(remaining);
    setSelectedPlugin(remaining[0] || null);
    setShowDenyModal(false);
    setDenialReason('');
  };

  return (
    <div className="bg-[#0b0f19] min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full text-xs font-bold text-amber-400 border border-amber-500/20 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Staff Moderation Portal</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Plugin Review Queue ({queue.length})
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">Inspect submitted plugins and security scans before releasing to the store</p>
          </div>
        </div>

        {queue.length === 0 ? (
          <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-16 text-center max-w-lg mx-auto">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-1">Queue is Clear!</h3>
            <p className="text-slate-400 text-sm">All submitted plugins have been reviewed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Queue List */}
            <div className="lg:col-span-4 space-y-3">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Pending Submissions
              </span>
              {queue.map(item => (
                <div
                  key={item.id}
                  onClick={() => setSelectedPlugin(item)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${selectedPlugin?.id === item.id ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/10' : 'bg-slate-900/80 border-white/10 hover:bg-slate-800'}`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-blue-400 uppercase tracking-wider">{item.game}</span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.submittedAt}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-400 flex items-center justify-between">
                    <span>by {item.author}</span>
                    <span className="font-bold text-emerald-400">${item.price}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Right Inspection Panel */}
            {selectedPlugin && (
              <div className="lg:col-span-8 bg-slate-900/90 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl space-y-6">
                <div className="flex items-start justify-between pb-4 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20">
                        {selectedPlugin.game}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{selectedPlugin.version}</span>
                    </div>
                    <h2 className="text-2xl font-black text-white">{selectedPlugin.title}</h2>
                    <p className="text-xs text-slate-400 mt-1">Submitted by <strong className="text-white">{selectedPlugin.author}</strong></p>
                  </div>

                  <MinoShieldBadge />
                </div>

                {/* Summary */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Overview</h4>
                  <p className="text-sm text-slate-300 bg-slate-800/60 p-4 rounded-xl border border-white/5 leading-relaxed">
                    {selectedPlugin.summary}
                  </p>
                </div>

                {/* File Attachment & Deep Scan */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCode className="w-8 h-8 text-blue-400" />
                    <div>
                      <p className="text-sm font-bold text-white">{selectedPlugin.fileName}</p>
                      <p className="text-xs text-slate-400">{selectedPlugin.fileSize} • Bytecode Decompiled & Verified</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" /> Download Archive
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 border-t border-white/5 flex items-center justify-end gap-4">
                  <button
                    onClick={() => setShowDenyModal(true)}
                    className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Deny / Request Changes</span>
                  </button>

                  <button
                    onClick={() => handleApprove(selectedPlugin.id)}
                    className="px-7 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Publish Live</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Denial Feedback Modal */}
        {showDenyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-white">
              <h3 className="text-xl font-bold text-white mb-2">Deny Plugin Submission</h3>
              <p className="text-xs text-slate-400 mb-4">
                Please provide detailed feedback so the author can fix the issue and resubmit.
              </p>

              <textarea
                rows={4}
                required
                placeholder="e.g. Please include default permissions in the documentation..."
                className="w-full bg-slate-800 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
                value={denialReason}
                onChange={(e) => setDenialReason(e.target.value)}
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDenyModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeny}
                  disabled={!denialReason.trim()}
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold shadow-md disabled:opacity-50"
                >
                  Confirm Denial
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default StaffReviewPage;
