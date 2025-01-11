import { ethers } from "ethers";

const connectWallet = async () => {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            return { provider, signer };
        } catch (error) {
            console.error("Wallet connection failed:", error);
        }
    } else {
        alert("MetaMask is not installed. Please install it to use this application.");
    }
};

export default connectWallet;
