import React, { useState } from 'react';
import { 
  FileText, Sparkles, Copy, Check, Download, RefreshCw, Crown, 
  BookOpen, Terminal, CheckCircle2
} from 'lucide-react';
import axios from 'axios';

const ReadmeWriterModal = ({ isOpen, onClose, pluginTitle = 'My Plugin', game = 'Minecraft' }) => {
  const [description, setDescription] = useState('');
  const [commands, setCommands] = useState('/reload, /help, /stats');
  const [permissions, setPermissions] = useState('plugin.admin, plugin.use');
  const [outputDocs, setOutputDocs] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e?.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('/api/ai/generate-docs', {
        title: pluginTitle,
        game,
        description: description.trim(),
        commands: commands.trim(),
        permissions: permissions.trim()
      });

      if (res.data && res.data.documentation) {
        setOutputDocs(res.data.documentation);
      }
    } catch (err) {
      console.warn('Doc generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!outputDocs) return;
    const blob = new Blob([outputDocs], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `README-${pluginTitle.toLowerCase().replace(/\s+/g, '-')}.md`;
    a.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-white">
      <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 p-0.5 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">AI README &amp; Documentation Writer</h3>
              <p className="text-xs text-slate-400">Generate professional markdown, installation tables, and permissions for your plugin.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl">✕</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Plugin Commands (comma-separated)
            </label>
            <input
              type="text"
              value={commands}
              onChange={(e) => setCommands(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Permission Nodes (comma-separated)
            </label>
            <input
              type="text"
              value={permissions}
              onChange={(e) => setPermissions(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Short Description / Feature Highlights
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Advanced multi-vault banking system with physical GUI ATMs, PIN codes, interest, and MySQL sync..."
            className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>{loading ? 'Writing Formatted Markdown & Tables...' : 'Generate Full Documentation'}</span>
        </button>

        {outputDocs && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-400">Generated README.md</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(outputDocs);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-white/10 flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .md</span>
                </button>
              </div>
            </div>

            <pre className="p-4 bg-slate-950 rounded-2xl border border-white/10 text-xs font-mono text-cyan-200 overflow-x-auto max-h-60 overflow-y-auto leading-relaxed">
              {outputDocs}
            </pre>
          </div>
        )}

      </div>
    </div>
  );
};

export default ReadmeWriterModal;
