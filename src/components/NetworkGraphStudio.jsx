import React, { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { 
  Share2, Lock, Unlock, ShieldAlert, Ban, Info, 
  Smartphone, MapPin, Building2, RefreshCw, ZoomIn, ZoomOut 
} from 'lucide-react';

export function NetworkGraphStudio({ 
  graphData, 
  onFreezeAccount, 
  onUnfreezeAccount, 
  onBulkFreezeCluster 
}) {
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeClusterTab, setActiveClusterTab] = useState('ALL');

  useEffect(() => {
    if (!containerRef.current || !graphData?.nodes) return;

    // Filter nodes if cluster tab selected
    let nodesToShow = graphData.nodes;
    let edgesToShow = graphData.edges;

    if (activeClusterTab !== 'ALL') {
      const targetCluster = graphData.clusters.find(c => c.id === activeClusterTab);
      if (targetCluster) {
        const clusterAccSet = new Set(targetCluster.accounts);
        nodesToShow = graphData.nodes.filter(n => clusterAccSet.has(n.id));
        edgesToShow = graphData.edges.filter(e => clusterAccSet.has(e.from) && clusterAccSet.has(e.to));
      }
    }

    const data = {
      nodes: new DataSet(nodesToShow),
      edges: new DataSet(edgesToShow)
    };

    const options = {
      nodes: {
        shape: 'dot',
        size: 24,
        font: {
          color: '#f8fafc',
          size: 11,
          face: 'Inter, system-ui, sans-serif'
        },
        borderWidth: 2,
        shadow: true
      },
      edges: {
        width: 2,
        arrows: {
          to: { enabled: true, scaleFactor: 0.8 }
        },
        smooth: {
          type: 'curvedCW',
          roundness: 0.2
        },
        shadow: false
      },
      physics: {
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -70,
          centralGravity: 0.015,
          springLength: 130,
          springConstant: 0.09,
          damping: 0.5
        },
        stabilization: { iterations: 120 }
      },
      interaction: {
        hover: true,
        tooltipDelay: 100,
        zoomView: true,
        dragView: true
      }
    };

    const network = new Network(containerRef.current, data, options);
    networkRef.current = network;

    network.on('click', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const nodeObj = graphData.nodes.find(n => n.id === nodeId);
        if (nodeObj) {
          setSelectedNode(nodeObj.metadata);
        }
      } else {
        setSelectedNode(null);
      }
    });

    return () => {
      if (network) network.destroy();
    };
  }, [graphData, activeClusterTab]);

  const handleZoom = (direction) => {
    if (!networkRef.current) return;
    const currentScale = networkRef.current.getScale();
    const newScale = direction === 'in' ? currentScale * 1.3 : currentScale / 1.3;
    networkRef.current.moveTo({ scale: newScale, animation: true });
  };

  const handleFit = () => {
    if (networkRef.current) {
      networkRef.current.fit({ animation: true });
    }
  };

  return (
    <div className="space-y-6">
      {/* Cluster Navigation & Control Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0c1324] border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Graph Neural Network (GNN) Mule Ring Visualizer
            </h3>
            <p className="text-xs text-slate-400">
              Multi-hop layering topologies, shared hardware collisions & centrality routing
            </p>
          </div>
        </div>

        {/* Cluster Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveClusterTab('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeClusterTab === 'ALL'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Accounts ({graphData?.nodes?.length || 0})
          </button>
          {graphData?.clusters?.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveClusterTab(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                activeClusterTab === c.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${c.is_mule_ring ? 'bg-red-400' : 'bg-emerald-400'}`} />
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas + Inspector Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Interactive Canvas */}
        <div className="xl:col-span-3 relative rounded-2xl bg-[#080d1a] border border-slate-800 shadow-2xl overflow-hidden h-[620px]">
          {/* Graph Legend Overlay */}
          <div className="absolute top-4 left-4 z-10 p-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-[11px] space-y-1.5 shadow-lg">
            <span className="font-bold text-slate-300 uppercase tracking-wider block mb-1">Topology Legend</span>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
              <span className="text-slate-300">Victim / Originator</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span className="text-slate-300">L1/L2 Mule Smurf</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
              <span className="text-slate-300">Mule Herder (Central Hub)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" />
              <span className="text-slate-300">Cashout / ATM / Crypto</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-500 border border-red-500 inline-block" />
              <span className="text-slate-300">Frozen Account (Lien)</span>
            </div>
          </div>

          {/* Graph Zoom Controls */}
          <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 shadow-lg">
            <button
              onClick={() => handleZoom('in')}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom('out')}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleFit}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
            >
              Center View
            </button>
          </div>

          {/* Vis Network Canvas Mounting Container */}
          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
        </div>

        {/* Right Inspector & Node Details Drawer */}
        <div className="rounded-2xl bg-[#0c1324] border border-slate-800 p-5 shadow-xl flex flex-col justify-between h-[620px] overflow-y-auto">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${selectedNode.is_frozen ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Account Inspector
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  selectedNode.is_frozen 
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40' 
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {selectedNode.is_frozen ? 'DEBIT FROZEN' : selectedNode.status}
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white tracking-tight">{selectedNode.holder}</h4>
                <div className="font-mono text-xs text-sky-400 mt-0.5">{selectedNode.id}</div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" /> Bank / Branch:
                  </span>
                  <span className="font-semibold text-white">{selectedNode.bank} ({selectedNode.city})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">KYC Level:</span>
                  <span className="font-semibold text-amber-300">{selectedNode.kyc || 'TIER_2_BASIC'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Available Balance:</span>
                  <span className="font-semibold text-white">₹{Number(selectedNode.balance || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Account Age:</span>
                  <span className="font-semibold text-slate-200">{selectedNode.age_days || 45} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-slate-400" /> Hardware IMEI:
                  </span>
                  <span className="font-mono text-[11px] text-purple-300">{selectedNode.device || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> IP Gateway:
                  </span>
                  <span className="font-mono text-[11px] text-sky-300">{selectedNode.ip || 'N/A'}</span>
                </div>
              </div>

              {/* Node Actions */}
              <div className="space-y-2 pt-2">
                {selectedNode.is_frozen ? (
                  <button
                    onClick={() => onUnfreezeAccount(selectedNode.id)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition cursor-pointer"
                  >
                    <Unlock className="w-3.5 h-3.5" /> Release & Unfreeze Account
                  </button>
                ) : (
                  <button
                    onClick={() => onFreezeAccount(selectedNode.id, "Analyst Manual Enforcement")}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" /> Freeze Account & Place Lien
                  </button>
                )}
                
                <button
                  onClick={() => alert(`Beneficiary ${selectedNode.id} successfully added to RBI Inter-Bank Blacklist rails.`)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
                >
                  <Ban className="w-3.5 h-3.5 text-amber-400" /> Push to NPCI Blacklist
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-500 space-y-3">
              <Info className="w-8 h-8 text-slate-600" />
              <div>
                <p className="text-xs font-semibold text-slate-400">No Account Selected</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Click any node in the topology canvas to inspect KYC profile, hardware IMEI collisions, and trigger instant freezes.
                </p>
              </div>
            </div>
          )}

          {/* Quick Stats Footer */}
          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Nodes: {graphData?.nodes?.length || 0}</span>
            <span>Layering Edges: {graphData?.edges?.length || 0}</span>
            <span className="text-red-400 font-semibold">Frozen: {graphData?.frozen_count || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
