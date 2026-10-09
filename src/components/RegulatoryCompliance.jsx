import React from 'react';
import { 
  ShieldCheck, FileText, CheckCircle2, Clock, 
  AlertOctagon, Landmark, Database, Lock, Globe 
} from 'lucide-react';

export function RegulatoryCompliance({ frozenAccounts, blacklistedList }) {
  const complianceFrameworks = [
    {
      title: "FIU-IND FINNET 2.0 Integration",
      status: "COMPLIANT & ACTIVE",
      badge: "XML / JSON Gateway",
      description: "Automated generation of Suspicious Transaction Reports (STR) and Cash Transaction Reports (CTR) formatted to FINNET 2.0 schema specifications.",
      sla: "100% Filed within 7-Day Window",
      icon: Landmark,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30"
    },
    {
      title: "RBI Master Direction on Fraud Reporting",
      status: "COMPLIANT",
      badge: "FMR-1 Reporting",
      description: "Mandatory classification of fraud proceeds, loan app extortion syndicates, and cyber mule accounts with automated report dispatch to RBI Fraud Registry.",
      sla: "Zero Delayed Filings",
      icon: ShieldCheck,
      color: "text-sky-400",
      bg: "bg-sky-500/10",
      border: "border-sky-500/30"
    },
    {
      title: "MHA / I4C National Cybercrime Portal",
      status: "TWO-WAY API SYNC",
      badge: "Real-Time Ingestion",
      description: "Immediate ingestion of 1930 / I4C cyber fraud complaints. Automatically matches disputed transaction UTRs and applies debit liens in under 100 milliseconds.",
      sla: "<100ms Action Latency",
      icon: AlertOctagon,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/30"
    },
    {
      title: "PMLA 2002 & Tamper-Proof Audit Trail",
      status: "CRYPTOGRAPHICALLY LOGGED",
      badge: "Section 12 Compliance",
      description: "Every ML inference decision, SHAP value breakdown, freeze timestamp, and analyst override is recorded in an immutable append-only audit trail.",
      sla: "10-Year Record Retention",
      icon: Database,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30"
    },
    {
      title: "FATF Recommendation 16 (Wire Transfer)",
      status: "COMPLIANT",
      badge: "Travel Rule",
      description: "Comprehensive cross-border originator and beneficiary information tracking across SWIFT, overseas remittance corridors, and digital assets.",
      sla: "Continuous Screening",
      icon: Globe,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/30"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Compliance Overview Banner */}
      <div className="p-6 rounded-2xl bg-[#0c1324] border border-slate-800 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Indian & International Regulatory Compliance Framework
            </h3>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            MuleShield AI enforces strict statutory alignment with Reserve Bank of India (RBI), Financial Intelligence Unit (FIU-IND), Ministry of Home Affairs (MHA/I4C), and Prevention of Money Laundering Act (PMLA 2002).
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 text-xs">
          <div className="text-center">
            <span className="text-[10px] uppercase text-slate-500 font-bold block">7-Day STR Mandate</span>
            <span className="font-mono text-sm font-bold text-emerald-400">100% On-Track</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-center">
            <span className="text-[10px] uppercase text-slate-500 font-bold block">Audit Integrity</span>
            <span className="font-mono text-sm font-bold text-sky-400">SHA-256 Verified</span>
          </div>
        </div>
      </div>

      {/* Compliance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {complianceFrameworks.map((cf, i) => {
          const Icon = cf.icon;
          return (
            <div
              key={i}
              className={`p-5 rounded-2xl bg-[#0c1324] border ${cf.border} shadow-lg flex flex-col justify-between space-y-4`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-xl ${cf.bg} ${cf.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${cf.bg} ${cf.color} border ${cf.border}`}>
                    {cf.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white tracking-tight mb-1.5">{cf.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{cf.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px] font-medium">{cf.badge}</span>
                <span className="font-semibold text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-sky-400" /> {cf.sla}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Shared Beneficiary Blacklist Management */}
      <div className="p-6 rounded-2xl bg-[#0c1324] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight">
                Inter-Bank Shared Beneficiary Blacklist (NPCI / Payment Rails)
              </h4>
              <p className="text-xs text-slate-400">Pushed to payment switches to block incoming credits and outgoing debits</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40">
            Active Blocklist ({frozenAccounts?.length || 4} Identifiers)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {["ACC-4102-UP (Rahul Sharma - L1 Mule)", "ACC-7719-HR (Vikas Yadav - L2 Smurf)", "ACC-8832-RJ (Amit Bishnoi - L2 Smurf)", "ACC-3310-WB (Karan Mehra - Herder)"].map((b, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <span className="font-mono text-slate-300 truncate">{b}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400">
                BLOCKED
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
