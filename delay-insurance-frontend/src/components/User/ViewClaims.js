import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import connectWallet from "../../utils/connectWallet";
import contractABI from "../../contract/DelayInsurance.json";

const contractAddress = "0x5037413dAD9058f93d37ba4e751500AAFdF70ae3";

const ViewClaims = () => {
    const [claims, setClaims] = useState([]);

    const fetchClaims = async () => {
        const { signer } = await connectWallet();
        const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);

        try {
            const userAddress = await signer.getAddress();
            const userClaims = await contract.getUserClaims(userAddress);

            const claimDetails = await Promise.all(
                userClaims.map(async (claimId) => {
                    const claim = await contract.claims(claimId);
                    return {
                        id: claimId.toString(),
                        status: claim.status,
                        amount: claim.amount,
                        delayTime: claim.delayTime,
                        ticketId: claim.ticketId, // Correct field name for Ticket ID
                    };
                })
            );

            setClaims(claimDetails);
        } catch (error) {
            console.error("Error fetching claims:", error);
        }
    };

    useEffect(() => {
        fetchClaims();
    }, []);

    const getStatusBadge = (status) => {
        const styles = {
            Pending: { backgroundColor: "#ffc107", color: "#fff" },
            Approved: { backgroundColor: "#28a745", color: "#fff" },
            Rejected: { backgroundColor: "#dc3545", color: "#fff" },
        };
        return (
            <span style={{ ...styles[status], padding: "5px 10px", borderRadius: "4px" }}>
                {status}
            </span>
        );
    };

    return (
        <div style={styles.container}>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Claim ID</th>
                        <th style={styles.th}>Amount (ETH)</th>
                        <th style={styles.th}>Delay Time (mins)</th>
                        <th style={styles.th}>Ticket ID</th>
                        <th style={styles.th}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {claims.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={styles.noClaims}>
                                No claims found.
                            </td>
                        </tr>
                    ) : (
                        claims.map((claim) => (
                            <tr key={claim.id}>
                                <td style={styles.td}>{claim.id}</td>
                                <td style={styles.td}>{ethers.formatEther(claim.amount)}</td>
                                <td style={styles.td}>{claim.delayTime.toString()}</td>
                                <td style={styles.td}>{claim.ticketId}</td>
                                <td style={styles.td}>{getStatusBadge(claim.status)}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

const styles = {
    container: {
        marginTop: "20px",
        padding: "20px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: "20px",
        backgroundColor: "#fff",
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
};

export default ViewClaims;
