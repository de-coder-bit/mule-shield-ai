import React from 'react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ReferenceLine 
} from 'recharts';
import { Sparkles, ShieldAlert, Cpu, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';

export function ShapExplainability({ selectedTx }) {
  if (!selectedTx) {
    return (
      <div className="rounded-2xl bg-[#0c1324] border border-slate-800 p-12 text-center text-slate-500 shadow-xl space-y-3">
        <Sparkles className="w-10 h-10 text-slate-600 mx-auto" />
        <h4 className="text-base font-bold text-slate-400">No Transaction Selected for SHAP Analysis</h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Select any transaction from the Live Command Center or Transaction Ledger to inspect its real-time SHAP feature attribution and multi-model ensemble breakdown.
        </p>
      </div>
    );
  }

  // Format data for Recharts
  const chartData = selectedTx.shap_factors?.map(f => ({
    name: f.feature,
    impact: f.impact,
    color: f.impact >= 18 ? '#ef4444' : f.impact >= 10 ? '#f59e0b' : '#38bdf8'
  })) || [
    { name: "Amount Deviation vs Peer Profile", impact: 18.2, color: "#ef4444" },
    { name: "High Velocity Bursts (10m)", impact: 15.6, color: "#ef4444" },
    { name: "Pass-Through Smurfing (In-Out Flow)", impact: 14.8, color: "#f59e0b" },
    { name: "Shared Hardware / IMEI Device Ring", impact: 12.0, color: "#f59e0b" },
    { name: "Clean Round Amount Structuring", impact: 6.0, color: "#38bdf8" }
  ];

  return (
    <div className="rounded-2xl bg-[#0c1324] border border-slate-800 p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                SHAP Explainability & Multi-Model Inference Dossier
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300">
                Inference: {selectedTx.inference_latency_ms || 14.2}ms
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Regulatory-grade feature contribution breakdown (PMLA Section 12 & RBI Explainability Standard)
            </p>
          </div>
        </div>

        {/* Transaction Summary Chip */}
        <div className="flex items-center gap-3 bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-700 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Transaction ID</span>
            <span className="font-mono font-bold text-slate-200">{selectedTx.id}</span>
          </div>
          <div className="h-6 w-px bg-slate-700" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Amount</span>
            <span className="font-bold text-emerald-400">₹{Number(selectedTx.amount || 0).toLocaleString('en-IN')}</span>
          </div>
          <div className="h-6 w-px bg-slate-700" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Composite Score</span>
            <span className={`font-bold ${selectedTx.risk_score >= 85 ? 'text-red-400' : 'text-amber-400'}`}>
              {selectedTx.risk_score}/100
            </span>
          </div>
        </div>
      </div>

      {/* Grid: SHAP Chart & Model Ensemble Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* SHAP Waterfall / Feature Impact Chart */}
        <div className="xl:col-span-2 rounded-xl bg-slate-900/60 border border-slate-800 p-5">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center justify-between">
            <span>Feature Contribution to Risk Score (SHAP Values)</span>
            <span className="text-[11px] text-slate-400 font-normal">Base Risk: +4.0 pts</span>
          </h4>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 140, bottom: 5 }}
              >
                <XAxis type="number" stroke="#64748b" fontSize={11} unit=" pts" />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} width={130} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val) => [`+${val} points to risk`, 'SHAP Attribution']}
                />
                <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3-Model AI Ensemble Verdict */}
        <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-sky-400" /> Ensemble Model Weights
            </h4>

            <div className="space-y-3.5">
              {/* XGBoost */}
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-200">XGBoost Tabular Classifier</span>
                  <span className="font-mono text-sky-400 font-bold">
                    {((selectedTx.model_ensemble?.xgboost_probability || 0.94) * 100).toFixed(1)}% Prob
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-sky-500 rounded-full" 
                    style={{ width: `${(selectedTx.model_ensemble?.xgboost_probability || 0.94) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Velocity, amount deviation & round numbers</span>
              </div>

              {/* LSTM Sequence */}
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-200">LSTM Behavioral Sequence Anomaly</span>
                  <span className="font-mono text-amber-400 font-bold">
                    {((selectedTx.model_ensemble?.lstm_sequence_anomaly_score || 0.88) * 100).toFixed(1)}% Anomaly
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full" 
                    style={{ width: `${(selectedTx.model_ensemble?.lstm_sequence_anomaly_score || 0.88) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">90-day rolling baseline vs sudden burst</span>
              </div>

              {/* GNN Graph */}
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-200">GNN Topological Centrality</span>
                  <span className="font-mono text-purple-400 font-bold">
                    {((selectedTx.model_ensemble?.gnn_graph_centrality_risk || 0.96) * 100).toFixed(1)}% Risk
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full" 
                    style={{ width: `${(selectedTx.model_ensemble?.gnn_graph_centrality_risk || 0.96) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Shared device collision & multi-hop fanout</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs">
            <div className="flex items-center gap-2 text-red-300 font-bold mb-1">
              <ShieldAlert className="w-4 h-4" /> Decision: {selectedTx.decision || "AUTO_FREEZE"}
            </div>
            <p className="text-[11px] text-slate-400">
              Triggered autonomous lien and held outgoing payment rails to prevent Hawala/ATM dissipation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
