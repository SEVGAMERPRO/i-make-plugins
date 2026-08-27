import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, AlertCircle, ArrowRight, Layers, FileCode, Lock, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = [
  'Minecraft',
  'Minecraft: 2b2t & Anarchy Clients',
  'Roblox',
  'FiveM',
  'Discord',
  'Websites & Tools',
  'Other'
];

const CreateResourceModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('Minecraft');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
        <div className="bg-slate-950 border border-white/20 rounded-3xl max-w-md w-full p-6 sm:p-8 text-center text-white space-y-6 shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center mx-auto text-white shadow-xl shadow-blue-500/20">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-black text-white">Login Required</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              You must be signed into your MinoForge account to create and publish plugins.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => {
                onClose();
                navigate('/login?redirect=/upload');
              }}
              className="btn-glow-blue btn-shimmer btn-animated w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In to Your Account</span>
            </button>

            <button
              onClick={() => {
                onClose();
                navigate('/register?redirect=/upload');
              }}
              className="btn-animated w-full py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-white/10 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-cyan-400" />
              <span>Create Free Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim() || title.trim().length < 3) {
      setError('Please provide a title for your resource (at least 3 characters).');
      return;
    }

    if (!summary.trim() || summary.trim().length < 5) {
      setError('Please provide a brief one-line summary for your resource.');
      return;
    }

    // Close modal and navigate to full upload editor with state
    onClose();
    navigate('/upload', {
      state: {
        title: title.trim(),
        summary: summary.trim(),
        category
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative text-white space-y-6 max-h-[92vh] overflow-y-auto hide-scrollbar">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-white">Create resource</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-500/15 border border-red-500/30 text-red-300 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleCreate} className="space-y-5 text-sm">
          
          {/* Title */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Title:
              </label>
              <span className="text-[11px] text-slate-500">{title.length}/60</span>
            </div>
            <input
              type="text"
              required
              maxLength={60}
              placeholder="e.g. Ultimate Economy & Multi-Vault"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800/90 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Give your resource a title. Resource titles must be concise, descriptive, and accurately represent your plugin.
            </p>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Summary:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. High-performance vault system with GUI ATMs, pin codes, and transaction logs."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-slate-800/90 border border-white/10 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Provide a very brief, one-line description of your resource.
            </p>
          </div>

          {/* Category Radios */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Category:
            </label>
            <div className="space-y-2 bg-slate-950/50 p-4 rounded-xl border border-white/5">
              {CATEGORIES.map((cat) => (
                <label 
                  key={cat}
                  className="flex items-center gap-3 cursor-pointer hover:text-blue-300 transition-colors py-0.5 text-xs text-slate-300"
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={category === cat}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-4 h-4 text-blue-600 bg-slate-800 border-white/20 focus:ring-blue-500"
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="btn-glow-blue btn-shimmer btn-animated w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Create</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default CreateResourceModal;
