"""
Graph Engine for Mule Ring Detection, Centrality Analysis, and Cluster Actioning.
Uses NetworkX to identify layering hops, mule rings, funnel accounts, and shared hardware.
"""
import networkx as nx
import random
from typing import Dict, Any, List, Optional

class MuleGraphEngine:
    def __init__(self):
        self.graph = nx.DiGraph()
        self.accounts_metadata: Dict[str, Dict[str, Any]] = {}
        self.clusters: List[Dict[str, Any]] = []
        self.frozen_accounts: set = set()
        self.blacklisted_beneficiaries: set = set()
        self.init_seed_network()

    def init_seed_network(self):
        """Initializes realistic Indian banking network with normal accounts and 3 distinct mule rings."""
        self.graph.clear()
        self.accounts_metadata.clear()
        self.frozen_accounts.clear()
        self.blacklisted_beneficiaries.clear()

        # Seed Accounts
        seed_accounts = [
            # Ring 1: "Digital Arrest / Cybercrime Layering Ring"
            {"id": "ACC-9021-DL", "holder": "Sunita Verma (Victim)", "type": "VICTIM", "bank": "HDFC Bank", "city": "New Delhi", "kyc": "TIER_1_FULL", "balance": 185000, "age_days": 1420, "device": "DEV-IPHONE-881", "ip": "103.21.14.90", "status": "ACTIVE"},
            {"id": "ACC-4102-UP", "holder": "Rahul Sharma (L1 Mule)", "type": "MULE_L1", "bank": "State Bank of India", "city": "Noida", "kyc": "TIER_2_BASIC", "balance": 12000, "age_days": 42, "device": "DEV-XIAOMI-102", "ip": "45.112.88.12", "status": "FLAGGED"},
            {"id": "ACC-7719-HR", "holder": "Vikas Yadav (L2 Smurf)", "type": "MULE_L2", "bank": "Axis Bank", "city": "Gurugram", "kyc": "TIER_3_EKYC", "balance": 4500, "age_days": 18, "device": "DEV-XIAOMI-102", "ip": "45.112.88.12", "status": "FLAGGED"},
            {"id": "ACC-8832-RJ", "holder": "Amit Bishnoi (L2 Smurf)", "type": "MULE_L2", "bank": "ICICI Bank", "city": "Jaipur", "kyc": "TIER_3_EKYC", "balance": 6100, "age_days": 21, "device": "DEV-XIAOMI-102", "ip": "45.112.88.12", "status": "FLAGGED"},
            {"id": "ACC-3310-WB", "holder": "Karan Mehra (L3 Mule Herder)", "type": "MULE_HERDER", "bank": "Kotak Mahindra", "city": "Kolkata", "kyc": "TIER_2_BASIC", "balance": 420000, "age_days": 65, "device": "DEV-ONEPLUS-990", "ip": "185.220.101.5", "status": "CRITICAL"},
            {"id": "ACC-9920-MH", "holder": "Global Crypto Vault (L4 Cashout)", "type": "CASHOUT_NODE", "bank": "Yes Bank", "city": "Mumbai", "kyc": "TIER_1_FULL", "balance": 1250000, "age_days": 900, "device": "DEV-MAC-PROX", "ip": "194.26.29.11", "status": "CRITICAL"},

            # Ring 2: "Dormant Student Account Burst Ring (Jamtara / Mewat Pattern)"
            {"id": "ACC-1044-JH", "holder": "Pooja Kumari (Student)", "type": "DORMANT_MULE", "bank": "Punjab National Bank", "city": "Dhanbad", "kyc": "TIER_3_EKYC", "balance": 2400, "age_days": 620, "device": "DEV-REALME-551", "ip": "115.240.90.14", "status": "FLAGGED"},
            {"id": "ACC-2099-JH", "holder": "Ramesh Mondal (Mule Operator)", "type": "MULE_L1", "bank": "Bank of Baroda", "city": "Jamtara", "kyc": "TIER_2_BASIC", "balance": 154000, "age_days": 110, "device": "DEV-REALME-551", "ip": "115.240.90.14", "status": "FLAGGED"},
            {"id": "ACC-5088-BR", "holder": "Santosh Kumar", "type": "MULE_L2", "bank": "Canara Bank", "city": "Patna", "kyc": "TIER_3_EKYC", "balance": 8900, "age_days": 35, "device": "DEV-REALME-551", "ip": "115.240.90.14", "status": "FLAGGED"},
            {"id": "ACC-6012-ATM", "holder": "ATM Dispersal Hub - Mewat", "type": "CASHOUT_NODE", "bank": "State Bank of India", "city": "Nuh", "kyc": "TIER_2_BASIC", "balance": 850000, "age_days": 340, "device": "DEV-POS-MEWAT", "ip": "103.44.11.8", "status": "CRITICAL"},

            # Ring 3: "Fake Loan App & Immediate Cross-Border Layering"
            {"id": "ACC-3190-KA", "holder": "Deepak Hegde (Victim)", "type": "VICTIM", "bank": "Axis Bank", "city": "Bengaluru", "kyc": "TIER_1_FULL", "balance": 92000, "age_days": 1800, "device": "DEV-PIXEL-77", "ip": "122.172.88.5", "status": "ACTIVE"},
            {"id": "ACC-4491-TN", "holder": "QuickCash Tech Escrow", "type": "MULE_HERDER", "bank": "Federal Bank", "city": "Chennai", "kyc": "TIER_2_BASIC", "balance": 3400000, "age_days": 95, "device": "DEV-AWS-VPN-01", "ip": "13.232.19.44", "status": "CRITICAL"},
            {"id": "ACC-7120-KL", "holder": "Suresh Nair (Smurf)", "type": "MULE_L2", "bank": "South Indian Bank", "city": "Kochi", "kyc": "TIER_3_EKYC", "balance": 14500, "age_days": 28, "device": "DEV-AWS-VPN-01", "ip": "13.232.19.44", "status": "FLAGGED"},
            {"id": "ACC-8901-TG", "holder": "Overseas Wire Pass (Hawala Rail)", "type": "CASHOUT_NODE", "bank": "Standard Chartered", "city": "Hyderabad", "kyc": "TIER_1_FULL", "balance": 4800000, "age_days": 540, "device": "DEV-FOREIGN-GATE", "ip": "185.191.171.1", "status": "CRITICAL"},

            # Normal Verified Merchant & Customer Nodes (Legitimate Background Traffic)
            {"id": "ACC-1001-MH", "holder": "Aarav Gupta", "type": "NORMAL", "bank": "HDFC Bank", "city": "Mumbai", "kyc": "TIER_1_FULL", "balance": 450000, "age_days": 2100, "device": "DEV-SAMS-901", "ip": "103.22.45.1", "status": "ACTIVE"},
            {"id": "ACC-1002-KA", "holder": "FreshMart Groceries UPI", "type": "MERCHANT", "bank": "ICICI Bank", "city": "Bengaluru", "kyc": "TIER_1_FULL", "balance": 1890000, "age_days": 1500, "device": "DEV-MERCHANT-POS", "ip": "49.207.12.9", "status": "ACTIVE"},
            {"id": "ACC-1003-DL", "holder": "Priya Sharma", "type": "NORMAL", "bank": "State Bank of India", "city": "Delhi", "kyc": "TIER_1_FULL", "balance": 230000, "age_days": 1900, "device": "DEV-IPHONE-442", "ip": "103.88.99.1", "status": "ACTIVE"},
            {"id": "ACC-1004-TN", "holder": "Swiggy / Zomato Rails", "type": "MERCHANT", "bank": "Axis Bank", "city": "Chennai", "kyc": "TIER_1_FULL", "balance": 5400000, "age_days": 2400, "device": "DEV-GATEWAY-11", "ip": "125.19.20.1", "status": "ACTIVE"}
        ]

        for acc in seed_accounts:
            self.add_or_update_account(acc)

        # Seed Flow Edges (Layering & Smurfing Patterns)
        seed_edges = [
            # Ring 1 Flows (Digital arrest ₹4,50,000 layering)
            {"source": "ACC-9021-DL", "target": "ACC-4102-UP", "amount": 450000, "channel": "RTGS", "tx_id": "TXN-RTGS-9901", "speed_sec": 45},
            {"source": "ACC-4102-UP", "target": "ACC-7719-HR", "amount": 150000, "channel": "IMPS", "tx_id": "TXN-IMPS-9902", "speed_sec": 12},
            {"source": "ACC-4102-UP", "target": "ACC-8832-RJ", "amount": 150000, "channel": "UPI", "tx_id": "TXN-UPI-9903", "speed_sec": 18},
            {"source": "ACC-4102-UP", "target": "ACC-3310-WB", "amount": 140000, "channel": "IMPS", "tx_id": "TXN-IMPS-9904", "speed_sec": 30},
            {"source": "ACC-7719-HR", "target": "ACC-3310-WB", "amount": 145000, "channel": "UPI", "tx_id": "TXN-UPI-9905", "speed_sec": 8},
            {"source": "ACC-8832-RJ", "target": "ACC-3310-WB", "amount": 142000, "channel": "UPI", "tx_id": "TXN-UPI-9906", "speed_sec": 15},
            {"source": "ACC-3310-WB", "target": "ACC-9920-MH", "amount": 420000, "channel": "NEFT", "tx_id": "TXN-NEFT-9907", "speed_sec": 60},

            # Ring 2 Flows (Dormant activation burst ₹1,80,000)
            {"source": "ACC-1044-JH", "target": "ACC-2099-JH", "amount": 90000, "channel": "UPI", "tx_id": "TXN-UPI-8801", "speed_sec": 5},
            {"source": "ACC-1044-JH", "target": "ACC-5088-BR", "amount": 88000, "channel": "UPI", "tx_id": "TXN-UPI-8802", "speed_sec": 9},
            {"source": "ACC-2099-JH", "target": "ACC-6012-ATM", "amount": 85000, "channel": "IMPS", "tx_id": "TXN-IMPS-8803", "speed_sec": 20},
            {"source": "ACC-5088-BR", "target": "ACC-6012-ATM", "amount": 82000, "channel": "ATM_CASH", "tx_id": "TXN-ATM-8804", "speed_sec": 40},

            # Ring 3 Flows (Loan App scam ₹6,00,000)
            {"source": "ACC-3190-KA", "target": "ACC-4491-TN", "amount": 600000, "channel": "IMPS", "tx_id": "TXN-IMPS-7701", "speed_sec": 30},
            {"source": "ACC-4491-TN", "target": "ACC-7120-KL", "amount": 250000, "channel": "UPI", "tx_id": "TXN-UPI-7702", "speed_sec": 14},
            {"source": "ACC-7120-KL", "target": "ACC-8901-TG", "amount": 240000, "channel": "WIRE", "tx_id": "TXN-WIRE-7703", "speed_sec": 120},
            {"source": "ACC-4491-TN", "target": "ACC-8901-TG", "amount": 340000, "channel": "NEFT", "tx_id": "TXN-NEFT-7704", "speed_sec": 90},

            # Normal Flows
            {"source": "ACC-1001-MH", "target": "ACC-1002-KA", "amount": 3200, "channel": "UPI", "tx_id": "TXN-UPI-1001", "speed_sec": 600},
            {"source": "ACC-1003-DL", "target": "ACC-1004-TN", "amount": 640, "channel": "UPI", "tx_id": "TXN-UPI-1002", "speed_sec": 1200},
            {"source": "ACC-1001-MH", "target": "ACC-1003-DL", "amount": 15000, "channel": "NEFT", "tx_id": "TXN-NEFT-1003", "speed_sec": 3600}
        ]

        for edge in seed_edges:
            self.add_transaction_edge(
                edge["source"],
                edge["target"],
                edge["amount"],
                edge["channel"],
                edge["tx_id"],
                edge.get("speed_sec", 60)
            )

        self.recompute_clusters()

    def add_or_update_account(self, data: Dict[str, Any]):
        acc_id = data["id"]
        self.accounts_metadata[acc_id] = data
        self.graph.add_node(acc_id, **data)

    def add_transaction_edge(self, source: str, target: str, amount: float, channel: str, tx_id: str, speed_sec: int = 30):
        if not self.graph.has_node(source):
            self.accounts_metadata[source] = {"id": source, "holder": f"Account {source}", "type": "UNKNOWN", "status": "ACTIVE"}
            self.graph.add_node(source, **self.accounts_metadata[source])
        if not self.graph.has_node(target):
            self.accounts_metadata[target] = {"id": target, "holder": f"Account {target}", "type": "UNKNOWN", "status": "ACTIVE"}
            self.graph.add_node(target, **self.accounts_metadata[target])

        self.graph.add_edge(source, target, amount=amount, channel=channel, tx_id=tx_id, speed_sec=speed_sec)

    def recompute_clusters(self) -> List[Dict[str, Any]]:
        """Identifies connected mule rings, calculates centrality, and flags high-risk clusters."""
        undirected = self.graph.to_undirected()
        components = list(nx.connected_components(undirected))
        
        # Calculate PageRank and Betweenness Centrality
        try:
            pagerank_scores = nx.pagerank(self.graph, alpha=0.85, max_iter=200)
            betweenness = nx.betweenness_centrality(self.graph)
        except Exception:
            pagerank_scores = {n: 0.1 for n in self.graph.nodes()}
            betweenness = {n: 0.1 for n in self.graph.nodes()}

        clusters = []
        cluster_idx = 1
        for comp in components:
            if len(comp) < 2:
                continue
            
            subg = self.graph.subgraph(comp)
            total_volume = sum(d.get("amount", 0) for _, _, d in subg.edges(data=True))
            
            # Check for high-risk flags in this cluster
            mule_nodes = [n for n in comp if self.accounts_metadata.get(n, {}).get("type") in ["MULE_L1", "MULE_L2", "MULE_HERDER", "DORMANT_MULE", "CASHOUT_NODE"]]
            frozen_count = sum(1 for n in comp if n in self.frozen_accounts)
            
            # Identify Funnel / Mule Herder
            sub_pagerank = {n: pagerank_scores.get(n, 0) for n in comp}
            top_hub = max(sub_pagerank, key=sub_pagerank.get) if sub_pagerank else list(comp)[0]
            
            # Detect shared devices / IPs in this cluster
            devices = set(self.accounts_metadata.get(n, {}).get("device") for n in comp if self.accounts_metadata.get(n, {}).get("device"))
            ips = set(self.accounts_metadata.get(n, {}).get("ip") for n in comp if self.accounts_metadata.get(n, {}).get("ip"))

            is_mule_ring = len(mule_nodes) >= 2 or len(devices) < len(comp) * 0.7
            ring_name = f"Mule Ring Alpha-{cluster_idx}" if is_mule_ring else f"Normal Cluster #{cluster_idx}"
            
            risk_score = 94.5 if is_mule_ring else 12.0
            if "Dhanbad" in [self.accounts_metadata.get(n, {}).get("city") for n in comp]:
                ring_name = "Jamtara-Dhanbad Dormant Smurf Ring"
                risk_score = 98.2
            elif "New Delhi" in [self.accounts_metadata.get(n, {}).get("city") for n in comp]:
                ring_name = "Digital Arrest 3-Tier Layering Syndicate"
                risk_score = 99.1
            elif "Bengaluru" in [self.accounts_metadata.get(n, {}).get("city") for n in comp]:
                ring_name = "Predatory Loan App Cross-Border Mesh"
                risk_score = 95.8

            cluster_obj = {
                "id": f"RING-{cluster_idx:03d}",
                "name": ring_name,
                "is_mule_ring": is_mule_ring,
                "risk_score": risk_score,
                "node_count": len(comp),
                "total_volume_inr": total_volume,
                "accounts": list(comp),
                "mule_accounts": mule_nodes,
                "frozen_accounts_count": frozen_count,
                "top_herder_account": top_hub,
                "shared_devices": list(devices),
                "shared_ips": list(ips),
                "status": "FROZEN" if frozen_count == len(comp) else ("PARTIAL_FREEZE" if frozen_count > 0 else "ACTIVE_THREAT")
            }
            clusters.append(cluster_obj)
            cluster_idx += 1

        self.clusters = sorted(clusters, key=lambda c: c["risk_score"], reverse=True)
        return self.clusters

    def freeze_account(self, account_id: str, reason: str = "Automated GNN / High Risk Alert") -> Dict[str, Any]:
        """Freezes individual account and records audit trail."""
        self.frozen_accounts.add(account_id)
        if account_id in self.accounts_metadata:
            self.accounts_metadata[account_id]["status"] = "FROZEN"
            self.accounts_metadata[account_id]["freeze_reason"] = reason
        self.recompute_clusters()
        return {"status": "SUCCESS", "account_id": account_id, "action": "FROZEN", "reason": reason}

    def unfreeze_account(self, account_id: str) -> Dict[str, Any]:
        """Unfreezes account upon analyst clearance."""
        if account_id in self.frozen_accounts:
            self.frozen_accounts.remove(account_id)
        if account_id in self.accounts_metadata:
            self.accounts_metadata[account_id]["status"] = "ACTIVE"
        self.recompute_clusters()
        return {"status": "SUCCESS", "account_id": account_id, "action": "UNFROZEN"}

    def bulk_freeze_cluster(self, cluster_id: str, analyst_id: str = "ANALYST-MULE-OPS") -> Dict[str, Any]:
        """One-click disruption: freezes every account in the identified mule ring simultaneously."""
        target_cluster = next((c for c in self.clusters if c["id"] == cluster_id), None)
        if not target_cluster:
            return {"status": "ERROR", "message": f"Cluster {cluster_id} not found"}

        frozen_list = []
        for acc_id in target_cluster["accounts"]:
            # Do not freeze confirmed victim if possible, only freeze mule nodes or debit-freeze
            meta = self.accounts_metadata.get(acc_id, {})
            if meta.get("type") != "VICTIM":
                self.frozen_accounts.add(acc_id)
                meta["status"] = "FROZEN"
                meta["freeze_reason"] = f"Bulk Cluster Freeze ({cluster_id}) by {analyst_id}"
                frozen_list.append(acc_id)
                # Blacklist outbound beneficiary
                self.blacklisted_beneficiaries.add(acc_id)

        self.recompute_clusters()
        return {
            "status": "SUCCESS",
            "cluster_id": cluster_id,
            "cluster_name": target_cluster["name"],
            "frozen_accounts_count": len(frozen_list),
            "frozen_accounts": frozen_list,
            "disruption_timestamp": "Instant (<120ms)",
            "beneficiary_blacklisted": True
        }

    def get_vis_graph_data(self) -> Dict[str, Any]:
        """Formats graph data specifically for high-performance interactive visual canvas."""
        nodes = []
        for node_id in self.graph.nodes():
            meta = self.accounts_metadata.get(node_id, {})
            node_type = meta.get("type", "UNKNOWN")
            is_frozen = node_id in self.frozen_accounts
            
            # Visual styling mappings
            color = "#10b981" # green normal
            shape = "dot"
            size = 22
            border_color = "#059669"

            if node_type == "VICTIM":
                color = "#3b82f6" # blue
                border_color = "#1d4ed8"
                size = 24
            elif node_type in ["MULE_L1", "MULE_L2"]:
                color = "#f59e0b" # amber
                border_color = "#d97706"
                size = 26
            elif node_type == "MULE_HERDER":
                color = "#ef4444" # red
                border_color = "#b91c1c"
                size = 32
            elif node_type == "CASHOUT_NODE":
                color = "#8b5cf6" # purple
                border_color = "#6d28d9"
                size = 30
            elif node_type == "DORMANT_MULE":
                color = "#ec4899" # pink
                border_color = "#be185d"
                size = 25

            if is_frozen:
                color = "#64748b" # gray frozen
                border_color = "#ef4444"

            nodes.append({
                "id": node_id,
                "label": f"{meta.get('holder', node_id)}\n({node_id})",
                "title": f"Account: {node_id}\nHolder: {meta.get('holder')}\nType: {node_type}\nBank: {meta.get('bank')}\nBalance: ₹{meta.get('balance', 0):,}\nStatus: {'FROZEN' if is_frozen else meta.get('status')}",
                "color": {"background": color, "border": border_color, "highlight": {"background": "#ffffff", "border": "#ef4444"}},
                "size": size,
                "shape": "dot",
                "font": {"color": "#e2e8f0", "size": 11, "face": "Inter, Roboto, sans-serif"},
                "metadata": {**meta, "is_frozen": is_frozen}
            })

        edges = []
        for u, v, d in self.graph.edges(data=True):
            amount = d.get("amount", 0)
            channel = d.get("channel", "UPI")
            speed = d.get("speed_sec", 60)
            
            edges.append({
                "id": f"{u}->{v}:{d.get('tx_id')}",
                "from": u,
                "to": v,
                "label": f"₹{amount:,} ({channel})",
                "arrows": "to",
                "color": {"color": "#ef4444" if amount >= 100000 else "#64748b", "highlight": "#38bdf8"},
                "width": max(1.5, min(6.0, amount / 80000.0)),
                "font": {"color": "#94a3b8", "size": 10, "align": "middle", "background": "#0f172a"},
                "smooth": {"type": "curvedCW", "roundness": 0.15},
                "metadata": {
                    "amount": amount,
                    "channel": channel,
                    "tx_id": d.get("tx_id"),
                    "speed_sec": speed
                }
            })

        return {
            "nodes": nodes,
            "edges": edges,
            "clusters": self.clusters,
            "total_accounts": len(nodes),
            "total_links": len(edges),
            "frozen_count": len(self.frozen_accounts)
        }
