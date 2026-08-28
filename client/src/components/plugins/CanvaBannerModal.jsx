import React, { useState } from 'react';
import { 
  Palette, Sparkles, ExternalLink, Check, X, RefreshCw, Crown, 
  Layers, Download, Image as ImageIcon, CheckCircle2, AlertCircle
} from 'lucide-react';
import axios from 'axios';

const CanvaBannerModal = ({ isOpen, onClose, pluginTitle = 'My Custom Plugin', onAcceptBanner }) => {
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [tagline, setTagline] = useState('OFFICIAL RELEASE');
  const [acceptedNotice, setAcceptedNotice] = useState('');

  const handleGenerateCanva = async () => {
    setLoading(true);
    setTemplates([]);
    setSelectedTemplate(null);
    setAcceptedNotice('');

    try {
      const res = await axios.post('/api/ai/canva-banner', {
        title: pluginTitle,
        tagline: tagline.trim()
      });

      if (res.data && res.data.templates) {
        setTemplates(res.data.templates);
      }
    } catch (err) {
      console.warn('Canva template generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-white">
      <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Design on Canva with AI</h3>
              <p className="text-xs text-slate-400">Generate high-res YouTube &amp; Marketplace banners, edit on Canva, then Accept or Deny.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl">✕</button>
        </div>

        {acceptedNotice && (
          <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{acceptedNotice}</span>
          </div>
        )}

        {/* Input parameters */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Banner Subtitle / Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. ULTIMATE VAULT & MULTI-CURRENCY"
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white uppercase font-mono"
            />
          </div>

          <button
            onClick={handleGenerateCanva}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{loading ? 'Creating Canva Templates with AI...' : 'Generate Canva Layout Designs'}</span>
          </button>
        </div>

        {/* Generated Templates List with Accept / Deny Buttons */}
        {templates.length > 0 && (
          <div className="space-y-4 pt-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
              Generated Banner Designs (Creator Review Required)
            </span>

            <div className="space-y-4">
              {templates.map((tpl) => (
                <div key={tpl.id} className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold text-white">{tpl.name}</strong>
                    <a
                      href={tpl.canvaTemplateUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <span>Open &amp; Edit on Canva</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* SVG Thumbnail Preview */}
                  <div 
                    className="rounded-xl overflow-hidden border border-white/10 bg-slate-900"
                    dangerouslySetInnerHTML={{ __html: tpl.previewSvg }}
                  />

                  {/* Accept / Deny Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => {
                        setTemplates(templates.filter(t => t.id !== tpl.id));
                      }}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold rounded-xl border border-red-500/30 flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Deny &amp; Discard</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTemplate(tpl);
                        if (onAcceptBanner) onAcceptBanner(tpl);
                        setAcceptedNotice(`✓ "${tpl.name}" accepted and set as plugin cover!`);
                        setTimeout(() => {
                          onClose();
                        }, 1200);
                      }}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept Design</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CanvaBannerModal;
