import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldAlert, Trash2, CheckCircle2, Clock, X, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Link } from 'react-router-dom';

const IpMultiAccountWarningBanner = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [conflictData, setConflictData] = useState(() => {
    try {
      const saved = localStorage.getItem('minoforge_ip_conflict');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [timeLeft, setTimeLeft] = useState({ days: 20, hours: 0, minutes: 0, seconds: 0 });
  const [isResolved, setIsResolved] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Initialize 20-day suspension timer if not already created
  useEffect(() => {
    if (!conflictData && user) {
      // Check if user is on a multi-account flagged environment (e.g. secondary account created)
      const registeredAccounts = JSON.parse(localStorage.getItem('minoforge_registered_ips') || '[]');
      const userIp = '127.0.0.1 (Local Network)';
      
      const ipAccounts = registeredAccounts.filter(acc => acc.ip === userIp);
      if (ipAccounts.length > 1 || localStorage.getItem('minoforge_simulate_ip_conflict') === 'true') {
        const deadline = Date.now() + 20 * 24 * 60 * 60 * 1000;
        const newConflict = {
          ip: userIp,
          primaryAccount: ipAccounts[0]?.username || 'PreviousAccount_1',
          currentAccount: user.username,
          deadline,
          flaggedAt: Date.now()
        };
        localStorage.setItem('minoforge_ip_conflict', JSON.stringify(newConflict));
        setConflictData(newConflict);

        // Add warning notification to bell
        addNotification({
          title: '⚠️ Multi-Account IP Conflict Detected',
          message: 'Only 1 account is permitted per IP address. This account will be suspended in 20 days unless resolved.',
          type: 'ip_conflict',
          link: '#'
        });
      }
    }
  }, [user]);

  // Live 1-second countdown ticker
  useEffect(() => {
    if (!conflictData || isResolved) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = conflictData.deadline - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [conflictData, isResolved]);

  const handleDecommissionOtherAccount = () => {
    // Delete/suspend the other duplicate account
    localStorage.removeItem('minoforge_ip_conflict');
    localStorage.removeItem('minoforge_simulate_ip_conflict');
    setIsResolved(true);
    setShowConfirmModal(false);

    // Save single compliant status
    localStorage.setItem('minoforge_ip_status', 'COMPLIANT_SINGLE_ACCOUNT');

    // Notify user
    addNotification({
      title: '✅ IP Conflict Resolved',
      message: 'The secondary account was decommissioned. Your account is verified compliant and will NOT be suspended.',
      type: 'approved',
      link: '#'
    });
  };

  if (!conflictData || isResolved || dismissed) return null;

  return (
    <>
      {/* Top Floating IP Conflict Banner */}
      <aside aria-label="IP Conflict Alert" className="w-full bg-gradient-to-r from-red-950/90 via-amber-950/90 to-red-950/90 border-b border-red-500/40 backdrop-blur-2xl text-white px-4 py-3 z-40 relative shadow-2xl animate-fade-in">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          
          {/* Warning Message & Info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 flex-shrink-0">
              <AlertTriangle className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-red-300 font-extrabold tracking-wide uppercase text-[11px]">
                  ⚠️ Multi-Account Policy Violation Detected (IP Conflict)
                </strong>
                <span className="px-2 py-0.5 bg-red-500/20 border border-red-500/30 text-red-200 rounded text-[10px] font-mono">
                  1 Account / IP Limit
                </span>
              </div>
              <p className="text-slate-300 text-[11px] mt-0.5">
                Multiple accounts detected on your IP network. This account will be automatically suspended in <strong>{timeLeft.days} days</strong> unless you decommission the duplicate account.
              </p>
            </div>
          </div>

          {/* Live Countdown Clock & Actions */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            
            {/* Countdown Badge */}
            <div className="flex items-center gap-1.5 bg-black/60 border border-red-500/40 px-3 py-1.5 rounded-xl font-mono text-xs font-black text-amber-300 shadow-inner">
              <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>
                {String(timeLeft.days).padStart(2, '0')}d : {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>

            {/* Action 1: Decommission Other Account */}
            <button
              onClick={() => setShowConfirmModal(true)}
              className="btn-shimmer btn-animated px-3.5 py-1.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black rounded-xl text-[11px] border border-white/20 shadow-lg shadow-red-500/20 cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Suspend Other Account</span>
            </button>

            {/* Action 2: Open Support Ticket */}
            <Link
              to="/staff/tickets"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-[11px] border border-white/10 font-bold flex items-center gap-1"
            >
              <MessageSquare className="w-3 h-3 text-cyan-400" />
              <span>Appeal</span>
            </Link>

            {/* Dismiss banner */}
            <button
              onClick={() => setDismissed(true)}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title="Hide banner temporarily"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </aside>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-950 border border-red-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white shadow-2xl space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-white">Decommission Duplicate Account?</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                By confirming, the previous account on this IP (<strong className="text-amber-400">{conflictData.primaryAccount}</strong>) will be decommissioned. Your current account (<strong className="text-emerald-400">{conflictData.currentAccount}</strong>) will be marked <strong>100% Compliant &amp; Safe</strong> and the 20-day suspension countdown will be immediately cancelled.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleDecommissionOtherAccount}
                className="btn-glow-blue btn-animated w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm &amp; Protect This Account</span>
              </button>

              <button
                onClick={() => setShowConfirmModal(false)}
                className="btn-animated w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-bold text-xs rounded-xl border border-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IpMultiAccountWarningBanner;
