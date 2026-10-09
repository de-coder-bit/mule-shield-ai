import React, { useState } from 'react';
import { 
  Zap, AlertTriangle, ShieldAlert, ArrowUpRight, ArrowDownLeft, 
  CheckCircle2, Clock, Lock, Unlock, Eye, Sparkles, Filter 
} from 'lucide-react';

export function LiveCommandCenter({ 
  transactions, 
  onSelectTx, 
  onFreezeAccount, 
  onUnfreezeAccount, 
  onBulkFreezeCluster, 
  clusters,
  frozenAccounts
}) {
  const [filterChannel, setFilterChannel] = useState('ALL');
  const [selectedTxDetail, setSelectedTxDetail] = useState(null);

  const filteredTxs = transactions.filter(t => {
    if (filterChannel === 'ALL') return true;
    if (filterChannel === 'SUSPICIOUS') return t.risk_score >= 65;
    return t.channel === filterChannel;
  });

  const getRiskBadge = (score, level) => {
    if (score >= 85) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
          <ShieldAlert className="w-3 h-3" /> Critical ({score})
        </span>
      );
    }
    if (score >= 65) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
          <AlertTriangle className="w-3 h-3" /> High Risk ({score})
        </span>
      );
    }
    if (score >= 40) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/20 text-blue-400 border border-blue-500/40">
          Watchlist ({score})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
        <CheckCircle2 className="w-3 h-3" /> Normal ({score})
      </span>
    );
  };

  const getChannelBadge = (ch) => {
    const colors = {
      UPI: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
      IMPS: "bg-sky-500/10 text-sky-300 border-sky-500/20",
      NEFT: "bg-purple-500/10 text-purple-300 border-purple-500/20",
      RTGS: "bg-amber-500/10 text-amber-300 border-amber-500/20",
      CARD: "bg-rose-500/10 text-rose-300 border-rose-500/20"
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${colors[ch] || 'bg-slate-800 text-slate-300'}`}>
        {ch}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Real-Time Transaction Ingestion Stream */}
      <div className="xl:col-span-2 rounded-2xl bg-[#0c1324] border border-slate-800/80 p-5 shadow-xl flex flex-col h-[700px]">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                Live Transaction Ingestion & Real-Time ML Scoring
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Latency: 14.2ms
                </span>
              </h3>
              <p className="text-xs text-slate-400">Inference across CBS, UPI Switch, NEFT, IMPS & I4C Cybercrime feeds</p>
            </div>
          </div>

          {/* Stream Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['ALL', 'SUSPICIOUS', 'UPI', 'IMPS', 'NEFT', 'RTGS'].map(f => (
              <button
                key={f}
                onClick={() => setFilterChannel(f)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  filterChannel === f
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction Stream List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pt-3 pr-1">
          {filteredTxs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs">
              Waiting for live transaction feed events...
            </div>
          ) : (
            filteredTxs.map((tx, idx) => (
              <div
                key={tx.id || idx}
                onClick={() => {
                  setSelectedTxDetail(tx);
                  if (onSelectTx) onSelectTx(tx);
                }}
                className={`group p-3.5 rounded-xl border transition-all cursor-pointer ${
                  tx.risk_score >= 85
                    ? 'bg-red-950/20 border-red-500/30 hover:border-red-500/60 hover:bg-red-950/30'
                    : tx.risk_score >= 65
                    ? 'bg-amber-950/15 border-amber-500/30 hover:border-amber-500/60'
                    : 'bg-slate-900/50 border-slate-800/80 hover:border-sky-500/40 hover:bg-slate-900/90'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    {getChannelBadge(tx.channel)}
                    <span className="font-mono text-xs font-semibold text-slate-300">
                      {tx.id}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {tx.timestamp}
                    </span>
                    {tx.i4c_flagged && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        I4C TICKET MATCH
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {getRiskBadge(tx.risk_score, tx.risk_level)}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2 text-xs">
                  {/* Sender */}
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4 text-rose-400 shrink-0" />
                    <div className="truncate">
                      <div className="font-medium text-slate-200 truncate">{tx.sender_name || tx.sender}</div>
                      <div className="font-mono text-[10px] text-slate-400">{tx.sender}</div>
                    </div>
                  </div>

                  {/* Receiver */}
                  <div className="flex items-center gap-2">
                    <ArrowDownLeft className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="truncate">
                      <div className="font-medium text-slate-200 truncate">{tx.receiver_name || tx.receiver}</div>
                      <div className="font-mono text-[10px] text-slate-400">{tx.receiver}</div>
                    </div>
                  </div>

                  {/* Amount & Quick Action */}
                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <div className="text-right">
                      <span className="text-sm font-bold text-white tracking-tight">
                        ₹{Number(tx.amount || 0).toLocaleString('en-IN')}
                      </span>
                      <div className="text-[10px] text-slate-400">
                        {tx.action_label || "Approved"}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectTx) onSelectTx(tx);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 text-sky-400 hover:bg-sky-600 hover:text-white transition cursor-pointer"
                      title="Inspect SHAP Explainability"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Column: Active Mule Syndicates & Fast Actions */}
      <div className="space-y-6">
        {/* Identified Mule Syndicates */}
        <div className="rounded-2xl bg-[#0c1324] border border-slate-800/80 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  GNN-Identified Mule Syndicates
                </h4>
                <p className="text-[11px] text-slate-400">Multi-hop coordinated account clusters</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">
              {clusters?.length || 0} Rings
            </span>
          </div>

          <div className="space-y-3">
            {clusters?.slice(0, 3).map((cluster, i) => (
              <div
                key={cluster.id || i}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-100">{cluster.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    cluster.status === 'FROZEN' ? 'bg-slate-800 text-slate-400' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {cluster.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 mb-3">
                  <div>Accounts: <span className="text-white font-semibold">{cluster.node_count} nodes</span></div>
                  <div>Risk Score: <span className="text-red-400 font-semibold">{cluster.risk_score}/100</span></div>
                  <div>Total Flow: <span className="text-white font-semibold">₹{(cluster.total_volume_inr || 0).toLocaleString('en-IN')}</span></div>
                  <div>Hub: <span className="font-mono text-sky-400">{cluster.top_herder_account}</span></div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onBulkFreezeCluster(cluster.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/30 transition cursor-pointer"
                  >
                    <Lock className="w-3 h-3" /> Bulk Freeze Ring
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rapid Action Workbench */}
        <div className="rounded-2xl bg-[#0c1324] border border-slate-800/80 p-5 shadow-xl">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Autonomous Intervention Policy
              </h4>
              <p className="text-[11px] text-slate-400">PMLA & RBI Pre-Emptive Protection</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-1 shrink-0" />
              <div>
                <span className="font-semibold text-white">Score ≥ 85 / I4C Match:</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Instant Automated Debit Freeze applied within &lt;100ms. Dispatches lien notification to CBS.</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-1 shrink-0" />
              <div>
                <span className="font-semibold text-white">Score 65 - 84 (Debit Cooling):</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Outbound transfers queued for 4 hours for AML analyst investigation before releasing funds.</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
              <div>
                <span className="font-semibold text-white">Score &lt; 45 (Pass-Through):</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Permitted with continuous behavioral sequence monitoring over 90-day rolling window.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
