import React, { useState } from 'react';
import { 
  Search, Filter, ArrowUpRight, ArrowDownLeft, ShieldAlert, 
  CheckCircle2, Clock, Sparkles, Download, RefreshCw 
} from 'lucide-react';

export function TransactionHub({ transactions, onSelectTx }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');

  const filtered = transactions.filter(t => {
    // Search
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      !searchTerm ||
      t.id?.toLowerCase().includes(searchLower) ||
      t.sender?.toLowerCase().includes(searchLower) ||
      t.receiver?.toLowerCase().includes(searchLower) ||
      t.sender_name?.toLowerCase().includes(searchLower) ||
      t.receiver_name?.toLowerCase().includes(searchLower) ||
      t.upi_ref?.toLowerCase().includes(searchLower);

    // Channel
    const matchesChannel = channelFilter === 'ALL' || t.channel === channelFilter;

    // Risk
    let matchesRisk = true;
    if (riskFilter === 'CRITICAL') matchesRisk = t.risk_score >= 85;
    else if (riskFilter === 'HIGH') matchesRisk = t.risk_score >= 65 && t.risk_score < 85;
    else if (riskFilter === 'LOW') matchesRisk = t.risk_score < 65;

    return matchesSearch && matchesChannel && matchesRisk;
  });

  const exportCSV = () => {
    const headers = "ID,Timestamp,Channel,Sender,SenderName,Receiver,ReceiverName,Amount,RiskScore,Decision,Action\n";
    const rows = filtered.map(t => 
      `"${t.id}","${t.timestamp}","${t.channel}","${t.sender}","${t.sender_name}","${t.receiver}","${t.receiver_name}","${t.amount}","${t.risk_score}","${t.decision}","${t.action_label}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `muleshield_transactions_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="rounded-2xl bg-[#0c1324] border border-slate-800 p-6 shadow-xl space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Cross-Channel Transaction Monitoring Ledger
          </h3>
          <p className="text-xs text-slate-400">
            Real-time multi-rail feeds (UPI, NEFT, IMPS, RTGS, Cards) enriched with AI inference scores
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search account, name, UTR..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 w-64"
            />
          </div>

          {/* Channel Dropdown */}
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="ALL">All Channels</option>
            <option value="UPI">UPI Rails</option>
            <option value="IMPS">IMPS Instant</option>
            <option value="NEFT">NEFT Batch</option>
            <option value="RTGS">RTGS High-Value</option>
            <option value="CARD">Card Authorization</option>
          </select>

          {/* Risk Level Dropdown */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical (≥85 Auto-Freeze)</option>
            <option value="HIGH">High (65-84 Cooling)</option>
            <option value="LOW">Low (&lt;65 Normal)</option>
          </select>

          {/* Export CSV */}
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" /> Export CSV
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase font-semibold text-[10px] tracking-wider">
              <th className="p-3.5">Tx ID & Time</th>
              <th className="p-3.5">Channel</th>
              <th className="p-3.5">Originator (Sender)</th>
              <th className="p-3.5">Beneficiary (Receiver)</th>
              <th className="p-3.5 text-right">Amount</th>
              <th className="p-3.5 text-center">ML Risk Score</th>
              <th className="p-3.5">Action Status</th>
              <th className="p-3.5 text-center">SHAP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-[#0a0f1d]/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500">
                  No matching transactions found.
                </td>
              </tr>
            ) : (
              filtered.map((t, idx) => (
                <tr
                  key={t.id || idx}
                  onClick={() => onSelectTx && onSelectTx(t)}
                  className="hover:bg-slate-800/40 transition cursor-pointer group"
                >
                  <td className="p-3.5 font-mono text-slate-300">
                    <div>{t.id}</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {t.timestamp}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-sky-300 border border-slate-700">
                      {t.channel}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="font-medium text-slate-200">{t.sender_name || t.sender}</div>
                    <div className="font-mono text-[10px] text-slate-500">{t.sender}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-medium text-slate-200">{t.receiver_name || t.receiver}</div>
                    <div className="font-mono text-[10px] text-slate-500">{t.receiver}</div>
                  </td>
                  <td className="p-3.5 text-right font-bold text-white">
                    ₹{Number(t.amount || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className={`inline-block font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                      t.risk_score >= 85
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40 font-extrabold'
                        : t.risk_score >= 65
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {t.risk_score}/100
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="text-[11px] text-slate-300">
                      {t.action_label || 'Approved'}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTx(t);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 text-sky-400 group-hover:bg-sky-600 group-hover:text-white transition cursor-pointer"
                      title="Inspect SHAP Breakdown"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-slate-400 flex items-center justify-between pt-1">
        <span>Showing {filtered.length} transactions</span>
        <span>Cross-channel correlation active across 5 switches</span>
      </div>
    </div>
  );
}
