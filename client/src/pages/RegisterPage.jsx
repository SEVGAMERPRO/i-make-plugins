import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';
import { Sparkles, ArrowRight, Lock, Mail, User, ShieldAlert } from 'lucide-react';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register, loginWithGoogle } = useAuth();
  const { config } = useConfig();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    setLoading(true);
    
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Username or email might be taken.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle(credentialResponse);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Google registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google registration was canceled or failed.');
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-[#0b0f19] py-16 px-4 sm:px-6 lg:px-8 text-white relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-8 bg-slate-900/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/10 relative z-10">
        <div className="text-center">
          <Link to="/" className="inline-block group mb-3">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-950/90 border border-cyan-400/40 p-2.5 flex items-center justify-center shadow-xl shadow-cyan-500/20 group-hover:scale-105 group-hover:border-cyan-400 transition-all">
              <img src="/favicon.svg" alt="MinoForge Myna Bird" className="w-full h-full object-contain" />
            </div>
          </Link>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Create MinoForge Account
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Join creators and server owners on the leading marketplace
          </p>
        </div>
        
        {config.registrationsEnabled === false && (
          <div className="bg-amber-500/15 border border-amber-500/40 text-amber-200 p-4 rounded-2xl text-xs text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 font-black text-amber-300">
              <ShieldAlert className="w-4 h-4" />
              <span>REGISTRATIONS PAUSED</span>
            </div>
            <p className="text-slate-300">New user sign-ups are temporarily closed by the platform administrator.</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3.5 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="block w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                placeholder="AwesomeDev"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email-address" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="block w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="block w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <span>{loading ? 'Creating account...' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {config.registrationsEnabled !== false && (
          <div className="space-y-4">
            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-slate-900 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 absolute">
                or continue with
              </span>
            </div>

            {/* Google Sign-In Option Underneath */}
            <GoogleSignInButton
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Sign-In failed')}
              text="Continue with Google"
            />
          </div>
        )}

        <div className="text-center pt-2 border-t border-white/5">
          <p className="text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
