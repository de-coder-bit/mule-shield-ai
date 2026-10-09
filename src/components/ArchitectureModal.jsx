import React from 'react';
import { X, Layers, Cpu, Database, Network, FileCheck, Shield, CheckCircle2 } from 'lucide-react';

export function ArchitectureModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const layers = [
    {
      layer: "L1: Data Ingestion Engine",
      purpose: "Real-time ingestion of cross-channel financial logs and cybercrime alert feeds.",
      freeStack: "FastAPI WebSockets + Python Asyncio / Apache Kafka (Open Source) / Redis PubSub",
      inputs: "Core Banking (CBS), UPI Switch, NEFT, RTGS, IMPS logs, Card Authorizations, MHA/I4C 1930 Cybercrime Portal API, RBI Fraud Registry, Bank FMS/TMS queues.",
      color: "border-sky-500/40 text-sky-400 bg-sky-500/10"
    },
    {
      layer: "L2: Feature Engineering & State Store",
      purpose: "Sub-millisecond calculation of behavioral deviations, graph features, and velocity metrics.",
      freeStack: "DuckDB / SQLite / NetworkX / In-Memory State Store (Open Source)",
      inputs: "10-minute velocity bursts, 90-day rolling baseline z-scores, dormancy-to-burst activation ratio, shared IMEI/device hash collisions, geofence hops, round amount structuring.",
      color: "border-purple-500/40 text-purple-400 bg-purple-500/10"
    },
    {
      layer: "L3: Multi-Model AI/ML Inference Ensemble",
      purpose: "Real-time multi-angle suspicious transaction and mule ring classification (<15ms latency).",
      freeStack: "Scikit-Learn / XGBoost + NetworkX (GNN Graph Centrality & Louvain) + PyTorch / LSTM + Free Google Gemini API",
      inputs: "1) XGBoost Tabular Classifier: Rapid scoring (<200ms) with SHAP explainability.\n2) GNN / Network Topology: Mule herder identification & ring community detection.\n3) LSTM Sequence Anomaly: Detects dormant-to-high velocity smurfing.\n4) Google Gemini LLM: Auto-drafts 5-part FIU-IND SAR narratives.",
      color: "border-amber-500/40 text-amber-400 bg-amber-500/10"
    },
    {
      layer: "L4: Decision & Autonomous Action Engine",
      purpose: "Zero-latency risk orchestration, auto-freezing, cooling queues, and syndicate disruptions.",
      freeStack: "Python Business Rule Engine + FastAPI REST / WebSocket Gateway",
      inputs: "Risk Score ≥ 85: Automated Instant Debit Freeze (<100ms).\nRisk Score 65-84: Debit Cooling Queue held for analyst investigation.\nGNN Mule Ring Flag: One-Click Bulk Network Disruption & Beneficiary Blacklist Broadcast.",
      color: "border-red-500/40 text-red-400 bg-red-500/10"
    },
    {
      layer: "L5: Regulatory Output & Statutory Compliance",
      purpose: "Seamless generation and submission of regulatory filings and law enforcement records.",
      freeStack: "Python XML / JSON Schemas + FINNET 2.0 Template Generator + SHA-256 Tamper Proof Logs",
      inputs: "FIU-IND FINNET 2.0 XML Suspicious Transaction Report (STR), RBI Master Direction FMR-1 reports, MHA / I4C National Cybercrime Portal two-way API, and PMLA 2002 10-year audit trail.",
      color: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0b101e] border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sky-500/20 text-sky-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Complete 5-Layer AI/ML Architecture (100% Free & Open-Source Stack)
              </h2>
              <p className="text-xs text-slate-400">
                End-to-end design blueprint based on the Solution Approach Document
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5-Layer Stack Cards */}
        <div className="space-y-4">
          {layers.map((l, i) => (
            <div
              key={i}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border ${l.color}`}>
                  {l.layer}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Free Stack: <strong className="text-slate-200">{l.freeStack}</strong>
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-200">{l.purpose}</p>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                {l.inputs}
              </div>
            </div>
          ))}
        </div>

        {/* Key Differentiators Table */}
        <div className="p-5 rounded-2xl bg-[#0e1628] border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Key Differentiators: Traditional Rules vs. MuleShield AI
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 font-semibold">
                  <th className="pb-2">Feature / Capability</th>
                  <th className="pb-2 text-rose-400">Traditional Bank FMS</th>
                  <th className="pb-2 text-emerald-400">MuleShield AI Solution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-2 font-medium">Detection Speed</td>
                  <td className="py-2 text-slate-400">Hours to Days (Batch T+1)</td>
                  <td className="py-2 text-emerald-300 font-bold">&lt; 200 ms (Real-Time T+0)</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">False Positive Rate</td>
                  <td className="py-2 text-slate-400">60% - 70% (Overwhelming)</td>
                  <td className="py-2 text-emerald-300 font-bold">&lt; 15% (ML Calibrated)</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Mule Ring Detection</td>
                  <td className="py-2 text-slate-400">Single Account Check Only</td>
                  <td className="py-2 text-emerald-300 font-bold">Multi-Hop Syndicate via GNN</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">SAR Narrative Generation</td>
                  <td className="py-2 text-slate-400">Manual Typing (3-4 Hours)</td>
                  <td className="py-2 text-emerald-300 font-bold">LLM Auto-Draft (&lt; 1 Minute)</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Explainability & Audit</td>
                  <td className="py-2 text-slate-400">None / Static Rule Code</td>
                  <td className="py-2 text-emerald-300 font-bold">SHAP Values + PMLA Immutable Log</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/30 transition cursor-pointer"
          >
            Close Architecture Blueprint
          </button>
        </div>
      </div>
    </div>
  );
}
