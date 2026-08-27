import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, Server, UserCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <div className="bg-[#0b0f19] min-h-screen text-white py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 rounded-full text-xs font-bold text-emerald-400 border border-emerald-500/20">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Data Protection & Privacy</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
            Your privacy and security are paramount. Learn how MinoForge collects, protects, and handles your information.
          </p>
        </div>

        {/* Privacy Commitments */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-slate-900/80 border border-white/10 p-5 rounded-2xl space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Eye className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">No Third-Party Ad Tracking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">We never sell, rent, or monetize your personal information to third-party ad networks.</p>
          </div>

          <div className="bg-slate-900/80 border border-white/10 p-5 rounded-2xl space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">End-to-End Encryption</h3>
            <p className="text-xs text-slate-400 leading-relaxed">All sessions, passwords, and 2FA codes are securely hashed and encrypted using industry standards.</p>
          </div>

          <div className="bg-slate-900/80 border border-white/10 p-5 rounded-2xl space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <UserCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">Full User Rights (GDPR)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Request full export or deletion of your account data anytime with one click.</p>
          </div>
        </div>

        {/* Detailed Policy Sections */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 space-y-8 text-sm text-slate-300 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400 font-mono">01.</span> Information We Collect
            </h2>
            <p>
              When you register or submit custom requests on <strong>MinoForge</strong>, we collect:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
              <li><strong>Account Data:</strong> Username, email address, password hash, and optional profile bio.</li>
              <li><strong>Order Data:</strong> Platform preferences, contact phone number, and project specifications.</li>
              <li><strong>Security Logs:</strong> IP address and login timestamps to protect against unauthorized account takeovers.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400 font-mono">02.</span> How We Use Your Information
            </h2>
            <p>
              We use your data solely to deliver digital downloads, provide custom plugin quotes, send order confirmations and 2FA verification codes, and prevent fraudulent activity.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400 font-mono">03.</span> Payment Processing
            </h2>
            <p>
              Payments are handled directly through certified tier-1 payment gateways (Stripe, PayPal). MinoForge never stores raw credit card numbers or banking secrets on our servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400 font-mono">04.</span> Data Retention &amp; Deletion
            </h2>
            <p>
              You may request full account deletion and data scrubbing at any time by emailing our privacy officer at <a href="mailto:minoforge.requests@gmail.com" className="text-emerald-400 hover:underline">minoforge.requests@gmail.com</a>.
            </p>
          </section>

        </div>

        {/* Back Link */}
        <div className="text-center pt-4">
          <Link 
            to="/" 
            className="btn-animated inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold rounded-xl text-xs border border-white/10"
          >
            <span>Return to Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPage;
