import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Share2, ListFilter, Sparkles, FileText, 
  ShieldCheck, Radio, AlertOctagon, Layers, ArrowUpRight 
} from 'lucide-react';

import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { LiveCommandCenter } from './components/LiveCommandCenter';
import { NetworkGraphStudio } from './components/NetworkGraphStudio';
import { TransactionHub } from './components/TransactionHub';
import { ShapExplainability } from './components/ShapExplainability';
import { CaseManagement } from './components/CaseManagement';
import { RegulatoryCompliance } from './components/RegulatoryCompliance';
import { ArchitectureModal } from './components/ArchitectureModal';

export function App() {
  const [activeTab, setActiveTab] = useState('COMMAND_CENTER');
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [], clusters: [], frozen_count: 0 });
  const [cases, setCases] = useState([]);
  const [selectedTx, setSelectedTx] = useState(null);
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [isArchModalOpen, setIsArchModalOpen] = useState(false);
  const [alertNotification, setAlertNotification] = useState(null);

  const wsRef = useRef(null);

  // Initialize data from REST API and setup WebSocket connection
  useEffect(() => {
    fetchInitialData();
    connectWebSocket();

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      const [ovResp, txResp, netResp, casesResp] = await Promise.all([
        fetch('/api/overview'),
        fetch('/api/transactions'),
        fetch('/api/network'),
        fetch('/api/cases')
      ]);

      if (ovResp.ok) {
        const ovData = await ovResp.json();
        setStats(ovData.stats);
      }
      if (txResp.ok) {
        const txData = await txResp.json();
        setTransactions(txData);
        if (txData.length > 0 && !selectedTx) {
          setSelectedTx(txData.find(t => t.risk_score >= 80) || txData[0]);
        }
      }
      if (netResp.ok) {
        const netData = await netResp.json();
        setGraphData(netData);
      }
      if (casesResp.ok) {
        const cData = await casesResp.json();
        setCases(cData);
      }
    } catch (e) {
      console.error("Initial fetch error:", e);
    }
  };

  const connectWebSocket = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/stream`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'NEW_TRANSACTION') {
          setTransactions(prev => [msg.data, ...prev.slice(0, 99)]);
          if (msg.stats) setStats(msg.stats);
          
          // Flash banner for critical transaction
          if (msg.data.risk_score >= 85) {
            setAlertNotification({
              title: `⚡ AUTO-FREEZE: ₹${Number(msg.data.amount).toLocaleString('en-IN')} on ${msg.data.channel}`,
              message: `Mule detected on ${msg.data.sender}. Outgoing lien applied.`,
              score: msg.data.risk_score
            });
            setTimeout(() => setAlertNotification(null), 5000);
          }
        } else if (msg.type === 'SIMULATION_TRIGGERED') {
          setTransactions(prev => [msg.transaction, ...prev.slice(0, 99)]);
          if (msg.network) setGraphData(msg.network);
          setSelectedTx(msg.transaction);
        } else if (msg.type === 'CLUSTER_FROZEN' || msg.type === 'ACCOUNT_ACTION') {
          // Refresh network state
          fetch('/api/network').then(r => r.json()).then(d => setGraphData(d));
          fetch('/api/overview').then(r => r.json()).then(d => setStats(d.stats));
        }
      } catch (e) {
        console.error("WebSocket message parse error:", e);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      setTimeout(connectWebSocket, 3000);
    };

    ws.onerror = () => {
      setIsConnected(false);
    };
  };

  const handleTriggerScenario = async (scenario) => {
    try {
      const resp = await fetch('/api/simulation/inject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario })
      });
      const data = await resp.json();
      if (data.transaction) {
        setSelectedTx(data.transaction);
        setAlertNotification({
          title: `Scenario Injected: ${scenario.replace('_', ' ').toUpperCase()}`,
          message: data.message,
          score: data.transaction.risk_score
        });
        setTimeout(() => setAlertNotification(null), 5000);
      }
    } catch (e) {
      console.error("Scenario trigger error:", e);
    }
  };

  const handleFreezeAccount = async (accountId, reason) => {
    try {
      const resp = await fetch(`/api/accounts/${accountId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'FREEZE', reason })
      });
      if (resp.ok) {
        fetchInitialData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUnfreezeAccount = async (accountId) => {
    try {
      const resp = await fetch(`/api/accounts/${accountId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UNFREEZE' })
      });
      if (resp.ok) {
        fetchInitialData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleBulkFreezeCluster = async (clusterId) => {
    try {
      const resp = await fetch('/api/network/freeze-cluster', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cluster_id: clusterId })
      });
      const data = await resp.json();
      if (data.status === 'SUCCESS') {
        alert(`⚡ SUCCESS: Mapped Mule Syndicate (${data.cluster_name}) completely frozen. ${data.frozen_accounts_count} accounts placed under lien.`);
        fetchInitialData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const navTabs = [
    { id: 'COMMAND_CENTER', label: 'Live Command Center', icon: Activity },
    { id: 'NETWORK_GRAPH', label: 'GNN Mule Ring Visualizer', icon: Share2 },
    { id: 'TRANSACTION_HUB', label: 'Transaction Ledger', icon: ListFilter },
    { id: 'SHAP_EXPLAIN', label: 'AI & SHAP Explainability', icon: Sparkles },
    { id: 'SAR_STUDIO', label: 'Cases & Gemini SAR Studio', icon: FileText },
    { id: 'REGULATORY', label: 'Regulatory Compliance', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Top Header */}
      <Header
        isConnected={isConnected}
        onTriggerScenario={handleTriggerScenario}
        geminiKey={geminiKey}
        setGeminiKey={setGeminiKey}
        onOpenArchitecture={() => setIsArchModalOpen(true)}
      />

      {/* Critical Alert Toast */}
      {alertNotification && (
        <div className="fixed top-20 right-6 z-50 max-w-md p-4 rounded-2xl bg-gradient-to-r from-red-950/90 to-[#0c1324] border border-red-500/50 shadow-2xl backdrop-blur-md animate-bounce">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-red-300">{alertNotification.title}</h4>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{alertNotification.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main App Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* KPI Metrics Strip */}
        <MetricCards stats={stats} />

        {/* Google AML AI Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg shadow-sky-600/30'
                    : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Views */}
        <div className="transition-all duration-300">
          {activeTab === 'COMMAND_CENTER' && (
            <LiveCommandCenter
              transactions={transactions}
              onSelectTx={(tx) => {
                setSelectedTx(tx);
                setActiveTab('SHAP_EXPLAIN');
              }}
              onFreezeAccount={handleFreezeAccount}
              onUnfreezeAccount={handleUnfreezeAccount}
              onBulkFreezeCluster={handleBulkFreezeCluster}
              clusters={graphData.clusters}
              frozenAccounts={graphData.frozen_count}
            />
          )}

          {activeTab === 'NETWORK_GRAPH' && (
            <NetworkGraphStudio
              graphData={graphData}
              onFreezeAccount={handleFreezeAccount}
              onUnfreezeAccount={handleUnfreezeAccount}
              onBulkFreezeCluster={handleBulkFreezeCluster}
            />
          )}

          {activeTab === 'TRANSACTION_HUB' && (
            <TransactionHub
              transactions={transactions}
              onSelectTx={(tx) => {
                setSelectedTx(tx);
                setActiveTab('SHAP_EXPLAIN');
              }}
            />
          )}

          {activeTab === 'SHAP_EXPLAIN' && (
            <ShapExplainability selectedTx={selectedTx} />
          )}

          {activeTab === 'SAR_STUDIO' && (
            <CaseManagement cases={cases} geminiKey={geminiKey} />
          )}

          {activeTab === 'REGULATORY' && (
            <RegulatoryCompliance
              frozenAccounts={graphData.nodes.filter(n => n.metadata?.is_frozen)}
              blacklistedList={graphData.clusters}
            />
          )}
        </div>
      </main>

      {/* Architecture Explainer Modal */}
      <ArchitectureModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#060911] px-6 py-4 text-center text-xs text-slate-500">
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-2">
          <span>MuleShield AI Platform &copy; 2026 — Built on Google AML AI Architecture & FIU-IND FINNET 2.0 Specs</span>
          <span className="text-slate-400">Open-Source Stack: Python FastAPI, Scikit-Learn, NetworkX, React 19, Google Gemini</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
