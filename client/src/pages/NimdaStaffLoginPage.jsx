import React, { useState, useEffect } from 'react';
import { Lock, Mail, Eye, EyeOff, CheckCircle2, ArrowRight, RefreshCw, AlertCircle, Shield } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import NimdaAdminDashboard from './NimdaAdminDashboard';

const NimdaStaffLoginPage = () => {
  const { loginWithToken } = useAuth();

  // Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Clear any existing stored admin session immediately upon mounting
  useEffect(() => {
    localStorage.removeItem('nimda_admin_auth');
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAdminLogout = () => {
    localStorage.removeItem('nimda_admin_auth');
    setIsAdminAuthenticated(false);
    setEmail('');
    setPassword('');
    setError('');
    setSuccessMsg('');
  };

  // Direct Email & Password Login
  const handleCredentialsLogin = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please provide both your administrator email/username and password.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/staff/login', {
        email: email.trim(),
        password: password
      });

      if (res.data?.success) {
        if (loginWithToken) {
          loginWithToken(res.data.token, res.data.user);
        } else {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }

        localStorage.setItem('nimda_admin_auth', 'true');
        setIsAdminAuthenticated(true);
      } else {
        setError(res.data?.message || 'Access denied.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid administrator credentials. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  // If already authenticated as Master Admin, render full Command & Control Dashboard
  if (isAdminAuthenticated) {
    return <NimdaAdminDashboard onLogout={handleAdminLogout} />;
  }

  return (
    <div className="min-h-screen bg-[#070a12] flex items-center justify-center p-4 sm:p-6 text-white relative overflow-hidden font-sans">
      
      {/* High-tech Cyber Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(#00f2fe_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md z-10 space-y-6">
        
        {/* Top Secret Gateway Emblem */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-950/90 border border-cyan-400/40 p-2.5 flex items-center justify-center shadow-xl shadow-cyan-500/20">
            <img src="/favicon.svg" alt="MinoForge Emblem" className="w-full h-full object-contain" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black tracking-widest uppercase shadow-lg shadow-red-500/10">
            <Lock className="w-3.5 h-3.5 animate-pulse" />
            <span>NIMDA SECRET GATEWAY</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white">
            Staff &amp; Command Portal
          </h1>
          <p className="text-xs text-slate-400">
            Authorized Personnel Only • Enter Master Credentials
          </p>
        </div>

        {/* Gateway Card Box */}
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          
          {/* Subtle Cyber Notch */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-purple-600" />

          {error && (
            <div className="p-3.5 bg-red-500/15 border border-red-500/30 rounded-2xl flex items-center gap-2.5 text-xs text-red-200 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && !error && (
            <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ================= DIRECT EMAIL & PASSWORD LOGIN FORM ================= */}
          <form onSubmit={handleCredentialsLogin} className="space-y-4 animate-fade-in">
            
            {/* Admin Email or Username */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Admin Email / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@colasmp.net or severinkaptein8@gmail.com"
                  className="w-full bg-slate-950/80 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
                />
              </div>
            </div>

            {/* Admin Password */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Master Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950/80 border border-white/15 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-glow-blue btn-shimmer btn-animated w-full py-3.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-500 hover:via-cyan-400 hover:to-blue-500 text-white font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-blue-500/25 cursor-pointer disabled:opacity-50 transition-all active:scale-95"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In to Nimda Gateway</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>

        {/* Footer Info */}
        <div className="text-center text-[11px] text-slate-500 space-y-1">
          <p className="flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Master Access Credentials Required</span>
          </p>
        </div>

      </div>

    </div>
  );
};

export default NimdaStaffLoginPage;
