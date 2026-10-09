import React, { useState } from 'react';
import { Shield, Radio, Key, Play, AlertOctagon, Zap, Layers, RefreshCw } from 'lucide-react';

export function Header({ 
  isConnected, 
  onTriggerScenario, 
  geminiKey, 
  setGeminiKey, 
  onOpenArchitecture,
  onResetNetwork 
}) {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(geminiKey || '');

  const handleSaveKey = () => {
    setGeminiKey(tempKey);
    localStorage.setItem('gemini_api_key', tempKey);
    setShowKeyModal(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0a0f1d]/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-500 shadow-lg shadow-sky-500/20">
            <Shield className="w-5 h-5 text-white" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0a0f1d]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-sky-400 bg-clip-text text-transparent">
                MuleShield AI
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Google AML AI Spec
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Real-Time Mule Detection & Regulatory Automation (FIU-IND / I4C / RBI)
            </p>
          </div>
        </div>

        {/* Live Attack Scenario Triggers */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 mr-1">
            <Play className="w-3.5 h-3.5 text-sky-400" /> Sim Scenarios:
          </span>
          <button
            onClick={() => onTriggerScenario('digital_arrest')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-300 border border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50 transition-all cursor-pointer"
            title="Inject ₹4.5L Digital Arrest scam with 3-tier layering"
          >
            <Zap className="w-3 h-3 text-red-400" /> Digital Arrest (₹4.5L)
          </button>
          <button
            onClick={() => onTriggerScenario('dormant_burst')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all cursor-pointer"
            title="Inject student dormant account burst with 9 rapid UPI hits"
          >
            <AlertOctagon className="w-3 h-3 text-amber-400" /> Jamtara Dormant Smurf
          </button>
          <button
            onClick={() => onTriggerScenario('i4c_match')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/30 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all cursor-pointer"
            title="Match incoming MHA I4C cybercrime portal alert ticket"
          >
            <Radio className="w-3 h-3 text-purple-400" /> MHA I4C Alert Match
          </button>
        </div>

        {/* Right Tools & Status */}
        <div className="flex items-center gap-3">
          {/* WebSocket Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-xs font-medium text-slate-300">
              {isConnected ? 'Stream Live (T+0)' : 'Reconnecting...'}
            </span>
          </div>

          {/* Architecture Explainer Button */}
          <button
            onClick={onOpenArchitecture}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-500/15 text-sky-300 border border-sky-500/30 hover:bg-sky-500/25 transition cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-sky-400" /> Full Architecture
          </button>

          {/* Gemini Key Config */}
          <button
            onClick={() => setShowKeyModal(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
              geminiKey 
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-sky-400" />
            <span>{geminiKey ? 'Gemini AI Active' : 'Configure Gemini AI'}</span>
          </button>
        </div>
      </div>

      {/* Gemini API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0f172a] border border-slate-700 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Google Gemini API Key (Optional)</h3>
                <p className="text-xs text-slate-400">Used for live SAR Suspicious Activity Report drafting</p>
              </div>
            </div>
            
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              You can provide a free Google Gemini API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-sky-400 underline">Google AI Studio</a>. If omitted, MuleShield AI seamlessly uses the built-in FIU-IND neural template generator.
            </p>

            <input
              type="password"
              placeholder="AIzaSy..."
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 mb-4"
            />

            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveKey}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/30 cursor-pointer"
              >
                Save & Activate
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
