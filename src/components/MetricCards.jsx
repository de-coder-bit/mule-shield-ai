import React from 'react';
import { TrendingUp, Clock, ShieldAlert, Lock, FileCheck2, Cpu } from 'lucide-react';

export function MetricCards({ stats }) {
  const cards = [
    {
      title: "Mule Detection Rate",
      value: stats?.detection_rate || "94.8%",
      subtext: "vs. 40% Traditional Rules",
      change: "+54.8%",
      isPositive: true,
      icon: TrendingUp,
      accent: "from-emerald-500/20 to-teal-500/5",
      border: "border-emerald-500/30",
      textAccent: "text-emerald-400"
    },
    {
      title: "Mean Time to Detect (MTTD)",
      value: stats?.mttd || "< 200 ms",
      subtext: "Real-time stream inference",
      change: "Sub-Second",
      isPositive: true,
      icon: Clock,
      accent: "from-sky-500/20 to-blue-500/5",
      border: "border-sky-500/30",
      textAccent: "text-sky-400"
    },
    {
      title: "Active Mule Rings / Clusters",
      value: stats?.active_mule_clusters || "3 Syndicates",
      subtext: "GNN Multi-Hop Discovery",
      change: "Mapped",
      isPositive: true,
      icon: ShieldAlert,
      accent: "from-amber-500/20 to-orange-500/5",
      border: "border-amber-500/30",
      textAccent: "text-amber-400"
    },
    {
      title: "Auto-Frozen Accounts",
      value: `${stats?.frozen_accounts_count || 0} Accounts`,
      subtext: "Immediate Debit Cooling",
      change: "Protected",
      isPositive: true,
      icon: Lock,
      accent: "from-red-500/20 to-rose-500/5",
      border: "border-red-500/30",
      textAccent: "text-red-400"
    },
    {
      title: "Intercepted Illicit Volume",
      value: stats?.intercepted_volume_inr ? `₹${(stats.intercepted_volume_inr / 100000).toFixed(2)} Lakhs` : "₹12.30 Lakhs",
      subtext: "Prevented cashout & hawala",
      change: "100% Lien",
      isPositive: true,
      icon: FileCheck2,
      accent: "from-purple-500/20 to-indigo-500/5",
      border: "border-purple-500/30",
      textAccent: "text-purple-400"
    },
    {
      title: "FIU FINNET 2.0 SLA",
      value: "100% On-Time",
      subtext: "Within 7-day RBI mandate",
      change: "Automated",
      isPositive: true,
      icon: Cpu,
      accent: "from-cyan-500/20 to-blue-500/5",
      border: "border-cyan-500/30",
      textAccent: "text-cyan-400"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 mb-6">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className={`relative p-4 rounded-xl bg-gradient-to-br ${c.accent} bg-[#0c1324] border ${c.border} shadow-lg transition-all hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider line-clamp-1">
                {c.title}
              </span>
              <div className={`p-1.5 rounded-lg bg-slate-900/60 ${c.textAccent}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-white tracking-tight mb-1">
              {c.value}
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-400">{c.subtext}</span>
              <span className={`font-semibold px-1.5 py-0.5 rounded bg-slate-900/80 ${c.textAccent}`}>
                {c.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
