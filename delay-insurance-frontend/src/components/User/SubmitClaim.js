import React, { useState } from "react";
import { ethers, ZeroAddress } from "ethers";
import connectWallet from "../../utils/connectWallet";
import contractABI from "../../contract/DelayInsurance.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const contractAddress = "0x80d517FbbbbbaDe77c8a965f1B05F28782Db777c";

const SubmitClaim = () => {
    const [amount, setAmount] = useState("");
    const [delayTime, setDelayTime] = useState("");
    const [ticket, setTicket] = useState(""); // New ticket field

    const handleSubmitClaim = async () => {
        try {
            const { signer } = await connectWallet();
            const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);

            const activeAccount = await signer.getAddress();
            const user = await contract.users(activeAccount);

            if (user.wallet === ZeroAddress) {
                toast.error("Active account is not registered.",{ autoClose: 5000 });
                return;
            }

            if (!amount || !delayTime || !ticket) {
                toast.error("Please fill in all fields.",{ autoClose: 5000 });
                return;
            }

            let gasEstimate;
            try {
                gasEstimate = await contract.estimateGas.submitClaim(
                    ethers.parseEther(amount),
                    parseInt(delayTime),
                    ticket // Pass ticket data
                );
            } catch {
                gasEstimate = 500000n;
            }

            const tx = await contract.submitClaim(
                ethers.parseEther(amount),
                parseInt(delayTime),
                ticket,
                { gasLimit: gasEstimate + 50000n }
            );

            await tx.wait();
            toast.success("Claim submitted successfully!",{ autoClose: 5000 });
            setAmount("");
            setDelayTime("");
            setTicket(""); // Reset ticket field
        } catch (error) {
            toast.error("Error submitting claim. Please try again.",{ autoClose: 5000 });
            console.error("Error:", error.message || error);
        }
    };

    return (
        <div style={styles.container}>
            <h3 style={styles.header}>Submit Claim</h3>
            <input
                type="number"
                placeholder="Enter claim amount (ETH)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={styles.input}
            />
            <input
                type="number"
                placeholder="Enter delay time in minutes"
                value={delayTime}
                onChange={(e) => setDelayTime(e.target.value)}
                style={styles.input}
            />
            <input
                type="text"
                placeholder="Enter ticket ID"
                value={ticket}
                onChange={(e) => setTicket(e.target.value)} // Corrected to update ticket state
                style={styles.input}
            />
            <button onClick={handleSubmitClaim} style={styles.button}>
                Submit Claim
            </button>
            <ToastContainer />
        </div>
    );
};

const styles = {
    container: {
        textAlign: "center",
        margin: "20px",
    },
    header: {
        color: "#343a40",
    },
    input: {
        padding: "10px",
        margin: "10px 0",
        width: "60%",
        border: "1px solid #ced4da",
        borderRadius: "4px",
    },
    button: {
        padding: "10px 20px",
        backgroundColor: "#28a745",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
};

export default SubmitClaim;
