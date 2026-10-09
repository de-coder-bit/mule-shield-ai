"""
Data Generator & Ingestion Stream Engine.
Simulates real-time cross-channel financial feeds (UPI, NEFT, IMPS, Cards, CBS, I4C tickets).
"""
import random
import time
from typing import Dict, Any, List

class DataStreamGenerator:
    def __init__(self, ml_engine, graph_engine):
        self.ml_engine = ml_engine
        self.graph_engine = graph_engine
        self.recent_transactions: List[Dict[str, Any]] = []
        self.cases: List[Dict[str, Any]] = []
        self.init_seed_cases()
        self.init_seed_transactions()

    def init_seed_cases(self):
        """Initializes realistic AML investigation cases."""
        self.cases = [
            {
                "case_id": "CASE-2026-9021",
                "title": "Digital Arrest 3-Tier Layering Syndicate (₹4.5L)",
                "primary_account": "ACC-4102-UP",
                "holder_name": "Rahul Sharma",
                "bank_name": "State Bank of India",
                "city": "Noida",
                "risk_score": 98.4,
                "typology": "Digital Arrest Extortion & Rapid Smurfing",
                "total_amount_inr": 450000,
                "channels": "RTGS, IMPS, UPI",
                "ring_name": "Digital Arrest 3-Tier Layering Syndicate",
                "linked_nodes_count": 5,
                "i4c_ticket": "I4C-2026-DL-88392",
                "status": "AUTO_FROZEN",
                "created_at": "2026-10-01 00:15:22",
                "ml_signals": {
                    "velocity_surge": "4,800% above 90-day baseline",
                    "inter_hop_latency": "14 seconds average",
                    "device_collision": "DEV-XIAOMI-102 shared with 3 accounts",
                    "pass_through_rate": "96.2% immediate debit"
                }
            },
            {
                "case_id": "CASE-2026-8802",
                "title": "Dormant Student Account Burst Ring (Jamtara Corridor)",
                "primary_account": "ACC-1044-JH",
                "holder_name": "Pooja Kumari (Student)",
                "bank_name": "Punjab National Bank",
                "city": "Dhanbad",
                "risk_score": 96.7,
                "typology": "Dormancy Awakening & Multi-UPI Dispersal",
                "total_amount_inr": 180000,
                "channels": "UPI, IMPS, ATM Cash",
                "ring_name": "Jamtara-Dhanbad Dormant Smurf Ring",
                "linked_nodes_count": 4,
                "i4c_ticket": "I4C-2026-JH-10442",
                "status": "COOLING_QUEUE",
                "created_at": "2026-10-01 00:20:05",
                "ml_signals": {
                    "dormancy_duration": "620 days zero activity",
                    "burst_window": "9 UPI credits within 180 seconds",
                    "device_collision": "DEV-REALME-551 shared across Jamtara cluster",
                    "destination": "High-risk Nuh/Mewat ATM extraction points"
                }
            },
            {
                "case_id": "CASE-2026-7704",
                "title": "Predatory Loan App & Overseas Hawala Mesh (₹6.0L)",
                "primary_account": "ACC-4491-TN",
                "holder_name": "QuickCash Tech Escrow",
                "bank_name": "Federal Bank",
                "city": "Chennai",
                "risk_score": 95.8,
                "typology": "Unauthorized Payment Aggregator & Offshore Pass",
                "total_amount_inr": 600000,
                "channels": "IMPS, UPI, Overseas Wire",
                "ring_name": "Predatory Loan App Cross-Border Mesh",
                "linked_nodes_count": 4,
                "i4c_ticket": "I4C-2026-TN-99014",
                "status": "INVESTIGATING",
                "created_at": "2026-10-01 00:22:40",
                "ml_signals": {
                    "vpn_proxy_detected": "DEV-AWS-VPN-01 overseas hosting endpoint",
                    "kyc_inconsistency": "Shell company entity with no physical presence",
                    "swift_flag": "Immediate wire hop to non-FATF compliant jurisdiction"
                }
            }
        ]

    def init_seed_transactions(self):
        """Generates initial batch of 25 realistic cross-channel transactions."""
        self.recent_transactions = []
        for i in range(25):
            tx = self.generate_single_transaction(force_normal=(i > 6))
            self.recent_transactions.append(tx)

    def generate_single_transaction(self, force_normal: bool = False, scenario: str = None) -> Dict[str, Any]:
        """Creates a transaction, evaluates it through the ML engine, and updates graph state."""
        tx_id = f"TXN-{random.choice(['UPI', 'IMPS', 'NEFT', 'RTGS', 'CARD'])}-{random.randint(10000, 99999)}"
        timestamp = time.strftime("%H:%M:%S")

        if scenario == "digital_arrest":
            sender = "ACC-9021-DL"
            receiver = "ACC-4102-UP"
            amount = 450000
            channel = "RTGS"
            profile = {
                "peer_avg_amount": 8000,
                "velocity_last_10m": 8,
                "dormancy_days": 10,
                "shared_device_count": 3,
                "i4c_alert": True,
                "in_out_ratio": 0.98
            }
            tx_data = {
                "id": tx_id,
                "timestamp": timestamp,
                "sender": sender,
                "sender_name": "Sunita Verma (Victim)",
                "receiver": receiver,
                "receiver_name": "Rahul Sharma (L1 Mule)",
                "amount": amount,
                "channel": channel,
                "hour": 2,
                "is_new_payee": True,
                "cross_channel_hop": True,
                "i4c_flagged": True,
                "upi_ref": "428819002198@axis"
            }
        elif scenario == "dormant_burst":
            sender = "ACC-1044-JH"
            receiver = "ACC-2099-JH"
            amount = 90000
            channel = "UPI"
            profile = {
                "peer_avg_amount": 1500,
                "velocity_last_10m": 9,
                "dormancy_days": 620,
                "shared_device_count": 2,
                "i4c_alert": True,
                "in_out_ratio": 0.95
            }
            tx_data = {
                "id": tx_id,
                "timestamp": timestamp,
                "sender": sender,
                "sender_name": "Pooja Kumari (Student Mule)",
                "receiver": receiver,
                "receiver_name": "Ramesh Mondal (Mule Op)",
                "amount": amount,
                "channel": channel,
                "hour": 3,
                "is_new_payee": True,
                "cross_channel_hop": True,
                "i4c_flagged": False,
                "upi_ref": "9812400199@ybl"
            }
        elif scenario == "i4c_match":
            sender = "ACC-4102-UP"
            receiver = "ACC-3310-WB"
            amount = 140000
            channel = "IMPS"
            profile = {
                "peer_avg_amount": 4000,
                "velocity_last_10m": 6,
                "dormancy_days": 0,
                "shared_device_count": 3,
                "i4c_alert": True,
                "in_out_ratio": 0.99
            }
            tx_data = {
                "id": tx_id,
                "timestamp": timestamp,
                "sender": sender,
                "sender_name": "Rahul Sharma",
                "receiver": receiver,
                "receiver_name": "Karan Mehra (Mule Herder)",
                "amount": amount,
                "channel": channel,
                "hour": 1,
                "is_new_payee": True,
                "cross_channel_hop": True,
                "i4c_flagged": True,
                "i4c_ticket": "I4C-2026-DL-88392",
                "upi_ref": "IMPS-REF-8891283"
            }
        elif force_normal:
            # Normal verified transaction
            normal_senders = [
                ("ACC-1001-MH", "Aarav Gupta"),
                ("ACC-1003-DL", "Priya Sharma"),
                ("ACC-9021-DL", "Sunita Verma")
            ]
            normal_receivers = [
                ("ACC-1002-KA", "FreshMart Groceries UPI"),
                ("ACC-1004-TN", "Swiggy / Zomato Rails"),
                ("ACC-1001-MH", "Aarav Gupta")
            ]
            s_pair = random.choice(normal_senders)
            r_pair = random.choice(normal_receivers)
            if s_pair[0] == r_pair[0]:
                r_pair = normal_receivers[0]
            
            amount = random.choice([250, 480, 1200, 2400, 3500, 8500, 12500])
            channel = random.choice(["UPI", "UPI", "UPI", "CARD", "IMPS", "NEFT"])
            profile = {
                "peer_avg_amount": 8000,
                "velocity_last_10m": 1,
                "dormancy_days": 0,
                "shared_device_count": 0,
                "i4c_alert": False,
                "in_out_ratio": 0.05
            }
            tx_data = {
                "id": tx_id,
                "timestamp": timestamp,
                "sender": s_pair[0],
                "sender_name": s_pair[1],
                "receiver": r_pair[0],
                "receiver_name": r_pair[1],
                "amount": amount,
                "channel": channel,
                "hour": random.randint(9, 21),
                "is_new_payee": False,
                "cross_channel_hop": False,
                "i4c_flagged": False,
                "upi_ref": f"{random.randint(1000000000, 9999999999)}@bank"
            }
        else:
            # Random dynamic feed
            is_suspicious = random.random() < 0.25
            if is_suspicious:
                amount = random.choice([45000, 90000, 150000, 240000, 480000])
                sender = random.choice(["ACC-4102-UP", "ACC-1044-JH", "ACC-4491-TN", "ACC-7719-HR"])
                receiver = random.choice(["ACC-3310-WB", "ACC-2099-JH", "ACC-8901-TG", "ACC-9920-MH"])
                channel = random.choice(["UPI", "IMPS", "NEFT"])
                profile = {
                    "peer_avg_amount": 4000,
                    "velocity_last_10m": random.randint(4, 8),
                    "dormancy_days": random.choice([0, 45, 120, 600]),
                    "shared_device_count": random.randint(1, 3),
                    "i4c_alert": random.random() < 0.3,
                    "in_out_ratio": random.uniform(0.7, 0.99)
                }
                tx_data = {
                    "id": tx_id,
                    "timestamp": timestamp,
                    "sender": sender,
                    "sender_name": f"Account {sender}",
                    "receiver": receiver,
                    "receiver_name": f"Account {receiver}",
                    "amount": amount,
                    "channel": channel,
                    "hour": random.choice([1, 2, 3, 23, 14]),
                    "is_new_payee": True,
                    "cross_channel_hop": True,
                    "i4c_flagged": profile["i4c_alert"],
                    "upi_ref": f"{random.randint(1000000000, 9999999999)}@paytm"
                }
            else:
                return self.generate_single_transaction(force_normal=True)

        # ML Engine Inference
        score_res = self.ml_engine.score_transaction(tx_data, profile)
        tx_data.update(score_res)

        # Update Graph
        self.graph_engine.add_transaction_edge(
            tx_data["sender"],
            tx_data["receiver"],
            tx_data["amount"],
            tx_data["channel"],
            tx_data["id"]
        )

        # Auto-freeze enforcement if score >= 85
        if score_res["decision"] == "AUTO_FREEZE":
            self.graph_engine.freeze_account(tx_data["sender"], f"Real-time ML Auto-Freeze (Score: {score_res['risk_score']})")

        return tx_data

    def record_new_transaction(self, tx: Dict[str, Any]):
        self.recent_transactions.insert(0, tx)
        if len(self.recent_transactions) > 100:
            self.recent_transactions.pop()
