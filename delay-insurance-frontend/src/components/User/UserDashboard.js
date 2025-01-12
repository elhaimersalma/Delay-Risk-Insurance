import React, { useState, useEffect } from "react";
import SubmitClaim from "./SubmitClaim";
import ViewClaims from "./ViewClaims";
import RegisterUser from "./RegisterUser";
import connectWallet from "../../utils/connectWallet";
import { ethers } from "ethers";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const contractAddress = "0x80d517FbbbbbaDe77c8a965f1B05F28782Db777c";
const contractABI = require("../../contract/DelayInsurance.json").abi;

const UserDashboard = () => {
    const [balance, setBalance] = useState("0");
    const [lastMonthData, setLastMonthData] = useState({ percentage: 0, amount: 0 });

    // Fetch user balance
    const fetchBalance = async () => {
        try {
            const { signer } = await connectWallet();
            const address = await signer.getAddress();
            const provider = signer.provider;
            const userBalance = await provider.getBalance(address);

            setBalance(ethers.formatEther(userBalance));
        } catch (error) {
            console.error("Error fetching balance:", error);
            toast.error("Failed to fetch user balance. Please try again.", { autoClose: 5000 });
        }
    };

    // Fetch user transaction history
    const fetchTransactionHistory = async () => {
        try {
            const { signer } = await connectWallet();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);

            const userAddress = await signer.getAddress();
            const userClaims = await contract.getUserClaims(userAddress);

            const claimDetails = await Promise.all(
                userClaims.map(async (claimId) => {
                    const claim = await contract.claims(claimId);
                    if (claim.status.trim().toLowerCase() === "approved") {
                        const timestamp = claim.timestamp || Math.floor(Date.now() / 1000);
                        return {
                            claimId: claimId.toString(),
                            amount: parseFloat(ethers.formatEther(claim.amount)) || 0,
                            timestamp,
                        };
                    }
                    return null;
                })
            );

            const approvedClaims = claimDetails.filter((claim) => claim !== null);
            const summary = {};
            approvedClaims.forEach((claim) => {
                const date = new Date(claim.timestamp * 1000);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const monthKey = `${year}-${String(month).padStart(2, "0")}`;

                if (!summary[monthKey]) summary[monthKey] = 0;
                summary[monthKey] += claim.amount;
            });

            const currentDate = new Date();
            const currentMonthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
            const currentMonthAmount = summary[currentMonthKey] || 0;
            const totalBalance = parseFloat(balance) || 0;

            const currentMonthPercentage =
                totalBalance > 0 ? ((currentMonthAmount / totalBalance) * 100).toFixed(2) : "0.00";

            setLastMonthData({ percentage: currentMonthPercentage, amount: currentMonthAmount.toFixed(4) });
        } catch (error) {
            console.error("Error fetching transaction history:", error);
            toast.error("Failed to fetch transaction history. Please try again.", { autoClose: 5000 });
        }
    };

    useEffect(() => {
        fetchBalance();
    }, []);

    useEffect(() => {
        if (parseFloat(balance) > 0) {
            fetchTransactionHistory();
        }
    }, [balance]);

    return (
        <div>
            {/* Navigation Bar */}
            <nav style={styles.navbar}>
                <h1 style={styles.navTitle}>ONCF Dashboard</h1>
            </nav>

            <div style={styles.container}>
                <h2 style={styles.header}>Welcome to Your Dashboard</h2>

                {/* User Balance Section */}
                <div style={styles.card}>
                    <h3 style={styles.cardHeader}>Your Balance</h3>
                    <div style={styles.balanceRow}>
                        <div style={styles.balanceCard}>
                            <div style={styles.iconWrapper}>
                                <i className="fas fa-wallet" style={styles.icon}></i>
                            </div>
                            <div>
                                <p style={styles.balance}>{balance} ETH</p>
                                <p style={styles.balanceLabel}>Total Balance</p>
                            </div>
                        </div>
                        <div style={styles.balanceCard}>
                            <div style={styles.iconWrapper}>
                                <i className="fas fa-chart-line" style={styles.icon}></i>
                            </div>
                            <div>
                                <p style={styles.balance}>{lastMonthData.amount} ETH</p>
                                <p style={styles.balanceLabel}>(+{lastMonthData.percentage}% This Month)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Register Section */}
                <div style={styles.card}>
                    <RegisterUser />
                </div>

                {/* Submit Claim Section */}
                <div style={styles.card}>
                    <SubmitClaim />
                </div>

                {/* View Claims Section */}
                <div style={styles.card}>
                    <ViewClaims />
                </div>

                {/* Toast Notifications */}
                <ToastContainer />
            </div>
        </div>
    );
};

const styles = {
    navbar: {
        backgroundColor: "#FF6F00", // ONCF Orange
        color: "white",
        padding: "15px 20px",
        display: "flex",
        justifyContent: "center",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    },
    navTitle: {
        margin: 0,
        fontSize: "24px",
        fontWeight: "bold",
    },
    container: {
        padding: "20px",
        maxWidth: "900px",
        margin: "20px auto",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    header: {
        textAlign: "center",
        color: "#343a40",
        marginBottom: "20px",
    },
    card: {
        backgroundColor: "#ffffff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        marginBottom: "20px",
    },
    cardHeader: {
        marginBottom: "10px",
        color: "#495057",
    },
    balanceRow: {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: "10px",
    },
    balanceCard: {
        display: "flex",
        alignItems: "center",
        backgroundColor: "#f1f3f5",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        width: "45%",
    },
    iconWrapper: {
        marginRight: "15px",
    },
    icon: {
        fontSize: "24px",
        color: "#007bff",
    },
    balance: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#343a40",
    },
    balanceLabel: {
        fontSize: "14px",
        color: "#6c757d",
    },
};

export default UserDashboard;
