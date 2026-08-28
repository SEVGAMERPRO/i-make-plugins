import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Server, Activity, ShieldCheck, Globe, Wifi, CheckCircle2, RefreshCw, Cpu, Database, ArrowRight } from 'lucide-react';

const NODES = [
  { id: 'node-us-east', name: 'US East (N. Virginia)', region: 'North America', ping: '24ms', status: 'Operational', load: '38%', uptime: '99.99%' },
  { id: 'node-eu-west', name: 'EU West (Frankfurt)', region: 'Europe', ping: '18ms', status: 'Operational', load: '42%', uptime: '99.98%' },
  { id: 'node-ap-east', name: 'Asia Pacific (Singapore)', region: 'Asia', ping: '65ms', status: 'Operational', load: '31%', uptime: '99.95%' },
  { id: 'node-cdn-edge', name: 'Global Anycast Edge CDN', region: 'Global Cloud (200+ PoPs)', ping: '12ms', status: 'Operational', load: '22%', uptime: '100.0%' },
];

const SERVICES = [
  { name: 'minoforge.com Primary Network Gateway', type: 'Gateway', status: 'Healthy', latency: '14ms' },
  { name: 'MinoShield Bytecode Security Scanner', type: 'Security AI', status: 'Active (100%)', latency: '45ms' },
  { name: 'Plugin Repository & Storage CDN', type: 'Storage Cluster', status: 'Healthy', latency: '19ms' },
  { name: 'Auth & 2FA Dispatch Mailer', type: 'API Service', status: 'Operational', latency: '120ms' },
];

const NetworkPortalPage = () => {
  const [lastRefreshed, setLastRefreshed] = useState(new Date().toLocaleTimeString());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastRefreshed(new Date().toLocaleTimeString());
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="bg-[#0b0f19] min-h-screen text-white py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-500/10 rounded-full text-xs font-bold text-emerald-400 border border-emerald-500/20 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>All Systems Operational</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              MinoForge Network Portal
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Live telemetry, infrastructure health, node clusters, and colasmp.net gateway status.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">Updated: {lastRefreshed}</span>
            <button
              onClick={handleRefresh}
              className={`btn-animated p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-white/10 ${isRefreshing ? 'animate-spin' : ''}`}
              title="Refresh status"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-white/10 p-5 rounded-2xl">
            <span className="text-xs text-slate-400 font-medium">Network Uptime</span>
            <p className="text-2xl font-black text-emerald-400 mt-1">99.98%</p>
            <span className="text-[11px] text-slate-500">Past 90 days</span>
          </div>

          <div className="bg-slate-900/80 border border-white/10 p-5 rounded-2xl">
            <span className="text-xs text-slate-400 font-medium">Avg Edge Latency</span>
            <p className="text-2xl font-black text-blue-400 mt-1">18ms</p>
            <span className="text-[11px] text-slate-500">Global response</span>
          </div>

          <div className="bg-slate-900/80 border border-white/10 p-5 rounded-2xl">
            <span className="text-xs text-slate-400 font-medium">MinoShield Scans</span>
            <p className="text-2xl font-black text-purple-400 mt-1">100%</p>
            <span className="text-[11px] text-slate-500">Zero exploits detected</span>
          </div>

          <div className="bg-slate-900/80 border border-white/10 p-5 rounded-2xl">
            <span className="text-xs text-slate-400 font-medium">Official Domain</span>
            <p className="text-lg font-black text-white mt-2 truncate">colasmp.net</p>
            <span className="text-[11px] text-emerald-400 font-bold">DNS Verified</span>
          </div>
        </div>

        {/* Node Clusters */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-400" />
              <span>Node Infrastructure &amp; Edge Clusters</span>
            </h2>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              4 / 4 Online
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NODES.map(node => (
              <div key={node.id} className="p-4 bg-slate-800/60 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">{node.name}</h3>
                    <span className="text-[11px] text-slate-400">{node.region}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    {node.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-white/5">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Ping</span>
                    <strong className="text-blue-300">{node.ping}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Cluster Load</span>
                    <strong className="text-white">{node.load}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Uptime</span>
                    <strong className="text-emerald-400">{node.uptime}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Services Status */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span>Platform Core Services</span>
          </h2>

          <div className="divide-y divide-white/5 text-sm">
            {SERVICES.map((serv, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white">{serv.name}</span>
                  <span className="text-xs text-slate-500 ml-2">({serv.type})</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-400 font-mono">{serv.latency}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    {serv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
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

export default NetworkPortalPage;
