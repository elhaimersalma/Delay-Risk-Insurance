import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import connectWallet from "../../utils/connectWallet";
import contractJSON from "../../contract/DelayInsurance.json"; // Ensure correct path

const contractAddress = "0x5037413dAD9058f93d37ba4e751500AAFdF70ae3";
const contractABI = contractJSON.abi;

const ApproveRejectClaims = () => {
    const [claimId, setClaimId] = useState("");
    const [allClaims, setAllClaims] = useState([]);
    const [filteredClaims, setFilteredClaims] = useState([]);
    const [filter, setFilter] = useState("All"); // Default filter is 'All'

    const fetchAllClaims = async () => {
        try {
            const { signer } = await connectWallet();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
    
            console.log("Fetching all claims...");
            const claimCounter = await contract.claimCounter();
            console.log("Total Claims:", claimCounter.toString());
    
            const claims = [];
            for (let i = 0; i < claimCounter; i++) {
                const claim = await contract.claims(i);
                const user = await contract.users(claim.user); // Fetch the username for each claim's user
    
                claims.push({
                    id: i,
                    user: claim.user,
                    name: user.name || "Unknown", // Use "Unknown" if no name is found
                    amount: claim.amount,
                    isPaid: claim.isPaid,
                    delayTime: claim.delayTime,
                    ticketId: claim.ticketId,
                    status: claim.status,
                });
            }
    
            console.log("All Claims with Names:", claims);
            setAllClaims(claims);
            setFilteredClaims(claims); // Default to showing all claims
        } catch (error) {
            console.error("Error fetching all claims:", error.message || error);
        }
    };
    

    useEffect(() => {
        fetchAllClaims();
    }, []);

    // Update the filtered claims whenever the filter changes
    useEffect(() => {
        if (filter === "All") {
            setFilteredClaims(allClaims);
        } else {
            setFilteredClaims(allClaims.filter((claim) => claim.status === filter));
        }
    }, [filter, allClaims]);

    const handleApprove = async () => {
        const { signer } = await connectWallet();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        try {
            console.log("Approving Claim ID:", claimId);

            const admin = await contract.admin();
            const userAddress = await signer.getAddress();

            if (admin.toLowerCase() !== userAddress.toLowerCase()) {
                throw new Error("You are not authorized to perform this action.");
            }

            const tx = await contract.approveClaim(claimId, {
                gasLimit: 500000n, // Set a safe gas limit
            });
            console.log("Transaction Sent:", tx);

            const receipt = await tx.wait();
            console.log("Transaction Receipt:", receipt);

            alert("Claim approved!");
            fetchAllClaims(); // Refresh the claims list
        } catch (error) {
            console.error("Error approving claim:", error.message || error);
            alert("Error approving claim: " + error.message);
        }
    };

    const handleReject = async (reason) => {
        const { signer } = await connectWallet();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        try {
            console.log("Rejecting Claim ID:", claimId);

            const admin = await contract.admin();
            const userAddress = await signer.getAddress();

            if (admin.toLowerCase() !== userAddress.toLowerCase()) {
                throw new Error("You are not authorized to perform this action.");
            }

            const tx = await contract.rejectClaim(claimId, reason);
            console.log("Transaction Sent:", tx);

            const receipt = await tx.wait();
            console.log("Transaction Receipt:", receipt);

            alert("Claim rejected!");
            fetchAllClaims(); // Refresh the claims list
        } catch (error) {
            console.error("Error rejecting claim:", error.message || error);
            alert("Error rejecting claim: " + error.message);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Admin Panel</h2>

            {/* Selector for filtering claims */}
            <div style={styles.filterContainer}>
                <label htmlFor="filter" style={styles.filterLabel}>Filter Claims:</label>
                <select
                    id="filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={styles.filterSelect}
                >
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            {/* Claims Table */}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Claim ID</th>
                        <th style={styles.th}>User Address</th>
                        <th style={styles.th}>User Name</th>
                        <th style={styles.th}>Amount (ETH)</th>
                        <th style={styles.th}>Delay Time (mins)</th>
                        <th style={styles.th}>Ticket ID</th>
                        <th style={styles.th}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredClaims.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={styles.noClaims}>No claims found</td>
                        </tr>
                    ) : (
                        filteredClaims.map((claim) => (
                            <tr key={claim.id}>
                                <td style={styles.td}>{claim.id}</td>
                                <td style={styles.td}>{claim.user}</td>
                                <td style={styles.td}>{claim.name}</td>
                                <td style={styles.td}>{ethers.formatEther(claim.amount)}</td>
                                <td style={styles.td}>{claim.delayTime.toString()}</td>
                                <td style={styles.td}>{claim.ticketId}</td>
                                <td style={styles.td}>{claim.status}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Approve/Reject Controls */}
            <div style={styles.controlContainer}>
                <input
                    type="number"
                    placeholder="Enter Claim ID"
                    value={claimId}
                    onChange={(e) => setClaimId(e.target.value)}
                    style={styles.input}
                />
                <button onClick={handleApprove} style={styles.buttonApprove}>Approve</button>
                <button onClick={() => handleReject("Invalid claim")} style={styles.buttonReject}>
                    Reject
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    header: {
        textAlign: "center",
        color: "#343a40",
        marginBottom: "20px",
    },
    filterContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },
    filterLabel: {
        fontSize: "16px",
        color: "#495057",
    },
    filterSelect: {
        padding: "8px",
        fontSize: "14px",
        borderRadius: "4px",
        border: "1px solid #ced4da",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: "20px",
    },
    th: {
        backgroundColor: "#343a40",
        color: "#ffffff",
        padding: "10px",
        textAlign: "left",
    },
    td: {
        padding: "10px",
        borderBottom: "1px solid #dee2e6",
    },
    noClaims: {
        textAlign: "center",
        padding: "20px",
        color: "#6c757d",
    },
    controlContainer: {
        display: "flex",
        gap: "10px",
        justifyContent: "space-between",
    },
    input: {
        flex: 1,
        padding: "10px",
        fontSize: "14px",
        borderRadius: "4px",
        border: "1px solid #ced4da",
    },
    buttonApprove: {
        padding: "10px 20px",
        backgroundColor: "#28a745",
        color: "#ffffff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    buttonReject: {
        padding: "10px 20px",
        backgroundColor: "#dc3545",
        color: "#ffffff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
};

export default ApproveRejectClaims;
