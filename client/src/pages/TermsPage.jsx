import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, Scale, Lock, AlertTriangle, HelpCircle, CheckCircle2, ArrowRight } from 'lucide-react';

const TermsPage = () => {
  return (
    <div className="bg-[#0b0f19] min-h-screen text-white py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 rounded-full text-xs font-bold text-blue-400 border border-blue-500/20">
            <Scale className="w-4 h-4 text-blue-400" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
            Last Updated: August 2026 • Please read these terms carefully before using MinoForge services or purchasing plugins.
          </p>
        </div>

        {/* Quick Highlights Summary Box */}
        <div className="bg-gradient-to-r from-blue-900/40 via-slate-900 to-slate-900 border border-blue-500/30 rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-base font-bold text-blue-300 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-400" />
            <span>Key Summary & Principles</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="p-3 bg-slate-800/60 rounded-xl border border-white/5">
              <strong className="text-white block mb-1">1. Creator Ownership</strong>
              Creators maintain 100% intellectual property ownership of their source code and plugins.
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl border border-white/5">
              <strong className="text-white block mb-1">2. Zero Malicious Code</strong>
              Strict zero-tolerance policy against backdoors, force-ops, token stealers, or trojans.
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl border border-white/5">
              <strong className="text-white block mb-1">3. Instant Digital Access</strong>
              Digital downloads are provided immediately upon verified checkout completion.
            </div>
            <div className="p-3 bg-slate-800/60 rounded-xl border border-white/5">
              <strong className="text-white block mb-1">4. Secure Payments</strong>
              Transactions are securely processed with automated fraud and chargeback protection.
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 space-y-8 text-sm text-slate-300 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-blue-400 font-mono">01.</span> Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, registering for an account, or purchasing digital resources on <strong>MinoForge</strong> (accessible via <code>minoforge.com</code> and affiliated subdomains), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-blue-400 font-mono">02.</span> User Accounts &amp; Security
            </h2>
            <p>
              When creating an account, you must provide accurate, complete, and verifiable email information. You are solely responsible for maintaining the confidentiality of your account credentials, 2-factor authentication codes, and for all activities that occur under your account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-blue-400 font-mono">03.</span> Digital Licenses &amp; Usage Rights
            </h2>
            <p>
              Purchases of plugins, scripts, or assets grant the buyer a non-exclusive, non-transferable license to use the product on their personal or commercial game servers. Unless explicitly authorized by the creator, you may not redistribute, re-sell, leak, or share downloaded resources.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-blue-400 font-mono">04.</span> Creator Publishing &amp; MinoShield Security
            </h2>
            <p>
              All resources submitted for publication must pass the <strong>MinoShield Automated Bytecode Verification</strong> and manual staff audit. Submitting intentional exploits, malicious obfuscation, crash exploits, or intellectual property infringements will result in permanent account termination.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-blue-400 font-mono">05.</span> Custom Plugin Commissions
            </h2>
            <p>
              Custom plugin orders submitted through our engineering studio are subject to tailored project milestone quotes. Delivery timelines begin after specification sign-off.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-blue-400 font-mono">06.</span> Non-Affiliation &amp; Trademark Notice
            </h2>
            <p>
              MinoForge (<code>minoforge.com</code>) is an independent platform for game server modifications. MinoForge is not affiliated with, endorsed by, or connected to the Conda-Forge Miniforge project, Mojang AB, Microsoft Corporation, Rockstar Games, Roblox Corporation, or Discord Inc.
            </p>
            <p>
              All trademarks and brand names are the property of their respective owners and are used solely for descriptive compatibility purposes under Nominative Fair Use.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-blue-400 font-mono">07.</span> DMCA &amp; Intellectual Property Takedowns
            </h2>
            <p>
              MinoForge respects all intellectual property rights and adheres to the Digital Millennium Copyright Act (DMCA). If you believe any content or plugin hosted on our platform infringes upon your copyright, please submit an official Notice of Infringement to <a href="mailto:support@minoforge.com" className="text-cyan-400 font-bold hover:underline">support@minoforge.com</a> or <a href="mailto:minoforge.requests@gmail.com" className="text-blue-400 hover:underline">minoforge.requests@gmail.com</a> with the exact resource link and proof of ownership. We review and remove verified infringing materials within 24 business hours.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-blue-400 font-mono">08.</span> Contact &amp; Support
            </h2>
            <p>
              For legal inquiries, billing questions, or security concerns, contact our team at <a href="mailto:support@minoforge.com" className="text-cyan-400 font-bold hover:underline">support@minoforge.com</a> or <a href="mailto:minoforge.requests@gmail.com" className="text-blue-400 hover:underline">minoforge.requests@gmail.com</a>.
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

export default TermsPage;
