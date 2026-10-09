import React, { useState } from 'react';
import { 
  FileText, Sparkles, Download, Copy, Check, ShieldAlert, 
  Send, Building2, User, Landmark, Clock, CheckCircle2 
} from 'lucide-react';

export function CaseManagement({ cases, geminiKey }) {
  const [selectedCase, setSelectedCase] = useState(cases[0] || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sarReport, setSarReport] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateSAR = async () => {
    if (!selectedCase) return;
    setIsGenerating(true);
    try {
      const resp = await fetch(`/api/cases/${selectedCase.case_id}/generate-sar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gemini_api_key: geminiKey })
      });
      const data = await resp.json();
      setSarReport(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadXML = () => {
    if (!selectedCase) return;
    window.open(`/api/regulatory/export-str/${selectedCase.case_id}`, '_blank');
  };

  const handleCopy = () => {
    if (sarReport?.narrative) {
      navigator.clipboard.writeText(sarReport.narrative);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Cases Queue */}
      <div className="rounded-2xl bg-[#0c1324] border border-slate-800 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                AML Investigation Cases
              </h3>
              <p className="text-xs text-slate-400">Multi-tier syndicates requiring regulatory filing</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
            {cases.length} Open
          </span>
        </div>

        <div className="space-y-3 overflow-y-auto max-h-[580px] pr-1">
          {cases.map((c) => (
            <div
              key={c.case_id}
              onClick={() => {
                setSelectedCase(c);
                setSarReport(null);
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedCase?.case_id === c.case_id
                  ? 'bg-purple-950/20 border-purple-500/50 shadow-lg shadow-purple-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-sky-400">{c.case_id}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  c.status === 'AUTO_FROZEN' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {c.status}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-100 line-clamp-1 mb-2">{c.title}</h4>

              <div className="space-y-1 text-[11px] text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Target:</span>
                  <span className="text-white font-medium">{c.holder_name} ({c.primary_account})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Aggregate Flow:</span>
                  <span className="text-emerald-400 font-bold">₹{Number(c.total_amount_inr || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>I4C Complaint:</span>
                  <span className="font-mono text-purple-300">{c.i4c_ticket}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SAR Studio & AI Generator */}
      <div className="xl:col-span-2 rounded-2xl bg-[#0c1324] border border-slate-800 p-6 shadow-xl flex flex-col justify-between space-y-6">
        {selectedCase ? (
          <>
            <div>
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white tracking-tight">
                      FIU-IND FINNET 2.0 & SAR Studio
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Case: {selectedCase.case_id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Auto-generate regulatory Suspicious Activity Report narrative adhering to PMLA 2002 & RBI standards.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGenerateSAR}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-lg shadow-sky-600/30 transition cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    {isGenerating ? 'Drafting with Gemini AI...' : 'Draft SAR with AI'}
                  </button>
                  <button
                    onClick={handleDownloadXML}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
                    title="Download Official FINNET 2.0 XML Payload"
                  >
                    <Download className="w-3.5 h-3.5 text-sky-400" /> FIU XML
                  </button>
                </div>
              </div>

              {/* Case Metadata Summary Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">Bank / Entity</span>
                  <span className="font-semibold text-white">{selectedCase.bank_name}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">Disputed Sum</span>
                  <span className="font-bold text-emerald-400">₹{Number(selectedCase.total_amount_inr || 0).toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">Typology</span>
                  <span className="font-semibold text-amber-300">{selectedCase.typology}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase block">Composite Risk</span>
                  <span className="font-bold text-red-400">{selectedCase.risk_score}/100</span>
                </div>
              </div>

              {/* Narrative Content Area */}
              <div className="relative rounded-xl bg-[#080d1a] border border-slate-800 p-4 font-mono text-xs text-slate-300 h-[380px] overflow-y-auto leading-relaxed">
                {sarReport ? (
                  <>
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1.5 text-sky-400 font-sans font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Engine: {sarReport.source}
                      </span>
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap font-mono text-slate-200">
                      {sarReport.narrative}
                    </pre>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 space-y-3">
                    <Sparkles className="w-8 h-8 text-sky-500/50" />
                    <div>
                      <p className="text-sm font-semibold text-slate-300">Ready to Draft Regulatory Narrative</p>
                      <p className="text-xs text-slate-500 max-w-md mt-1">
                        Click <span className="text-sky-400 font-semibold">"Draft SAR with AI"</span> above to synthesize structured case telemetry, GNN topology hops, and PMLA violations into an official FINNET 2.0 report.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-400" /> Auto-Freeze Lien Recorded in CBS & NPCI
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`SAR successfully submitted to FIU-IND Gateway with Reference ${selectedCase.case_id}. Audit trail token logged.`)}
                  className="px-4 py-2 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition cursor-pointer"
                >
                  Transmit to FIU-IND (FINNET 2.0)
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
