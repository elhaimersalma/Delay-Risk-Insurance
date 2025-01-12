import React, { useState, useEffect } from "react";
import ApproveRejectClaims from "./ApproveRejectClaims";
import connectWallet from "../../utils/connectWallet";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";

const contractAddress = "0x80d517FbbbbbaDe77c8a965f1B05F28782Db777c";
const contractABI = require("../../contract/DelayInsurance.json").abi;

const AdminDashboard = () => {
        const [balance, setBalance] = useState("0");
        const [lastMonthData, setLastMonthData] = useState({ percentage: 0, amount: 0 });
        
        
        const fetchBalance = async () => {
            try {
                const { signer } = await connectWallet();
                const address = await signer.getAddress();
                const provider = signer.provider;
                const userBalance = await provider.getBalance(address);
    
                setBalance(ethers.formatEther(userBalance));
            } catch (error) {
                console.error("Error fetching balance:", error);
                toast.error("Failed to fetch user balance.");
            }
        };   
        const fetchAllClaims = async () => {
            try {
                const { signer } = await connectWallet();
                const contract = new ethers.Contract(contractAddress, contractABI, signer);
        
                // Fetch all claim IDs
                const allClaimIds = await contract.getAllClaimIds();
        
                // Fetch details for each claim
                const claimDetails = await Promise.all(
                    allClaimIds.map(async (claimId) => {
                        const claim = await contract.claims(claimId);
        
                        return {
                            claimId: claimId.toString(),
                            user: claim.user,
                            amount: parseFloat(ethers.formatEther(claim.amount)),
                            isPaid: claim.isPaid,
                            delayTime: claim.delayTime,
                            status: claim.status,
                            ticketId: claim.ticketId,
                        };
                    })
                );
        
                console.log("All Claims:", claimDetails);
        
                // Calculate total paid amount (admin losses)
                const totalPaidAmount = claimDetails
                    .filter((claim) => claim.isPaid) // Filter only paid claims
                    .reduce((sum, claim) => sum + claim.amount, 0); // Sum up the amounts
        
                console.log("Total Paid Amount:", totalPaidAmount);
        
                // Fetch contract balance
                 
        
                console.log("Contract Balance:", balance);
        
                // Calculate the percentage loss
                const percentageLoss = balance > 0 ? ((totalPaidAmount / balance) * 100).toFixed(2) : "0.00";
        
                console.log(`Admin Loss Percentage: ${percentageLoss}%`);
        
                // Filter for approved claims
                const approvedClaims = claimDetails.filter((claim) => claim !== null);
        
                // Aggregate claims data by month
                const summary = {};
                approvedClaims.forEach((claim) => {
                    const date = new Date(claim.timestamp * 1000);
                    const year = date.getFullYear();
                    const month = date.getMonth() + 1;
                    const monthKey = `${year}-${String(month).padStart(2, "0")}`;
        
                    if (!summary[monthKey]) summary[monthKey] = 0;
                    summary[monthKey] += claim.amount;
                });
        
                // Current month calculations
                const currentDate = new Date();
                const currentMonthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
                const currentMonthAmount = summary[currentMonthKey] || 0;
                const totalBalance = parseFloat(balance) || 0;
        
                const currentMonthPercentage =
                    totalBalance > 0 ? ((currentMonthAmount / totalBalance) * 100).toFixed(2) : "0.00";
        
                setLastMonthData({ 
                    percentage: percentageLoss, 
                    amount: totalPaidAmount.toFixed(4) 
                });
        
                // setAdminLossData({
                //     totalPaidAmount: totalPaidAmount.toFixed(4),
                //     lossPercentage: percentageLoss,
                // });
            } catch (error) {
                console.error("Error fetching transaction history:", error);
                toast.error("Failed to fetch transaction history.");
            }
        };
        
    
        useEffect(() => {
            fetchBalance();
        }, []);
    
        useEffect(() => {
            if (parseFloat(balance) > 0) {
                fetchAllClaims();
            }
        }, [balance]);             
    return (
        <div>
            {/* Navigation Bar */}
            <nav style={styles.navbar}>
                <h1 style={styles.navTitle}>ONCF Dashboard</h1>
            </nav>
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
                                <p style={styles.balanceLabel}> (-{lastMonthData.percentage}% This Month)</p>
                            </div>
                        </div>
                    </div>
                </div>
            {/* <h2>Admin Dashboard</h2> */}
            <ApproveRejectClaims />
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


export default AdminDashboard;
