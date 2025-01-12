import React, { useEffect, useState,useRef } from "react";
import { ethers, ZeroAddress } from "ethers"; // Updated import
import connectWallet from "../../utils/connectWallet";
import contractABI from "../../contract/DelayInsurance.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const contractAddress = "0x80d517FbbbbbaDe77c8a965f1B05F28782Db777c";

const RegisterUser = () => {
    const [isRegistered, setIsRegistered] = useState(false);
    const [userName, setUserName] = useState(""); // User-provided or fetched name
    const [accountName, setAccountName] = useState(""); // Fetched name for registered users
    const toastShown = useRef(false); // Ref to track if the toast has been shown


    const checkRegistration = async () => {
        try {
            const { signer } = await connectWallet();
            const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);
            const activeAccount = await signer.getAddress();

            // Check if the account is already registered
            const user = await contract.users(activeAccount);
            console.log("User Details:", user);

            if (user.wallet !== ZeroAddress) { // Updated check using ethers.ZeroAddress
                setIsRegistered(true);
                setAccountName(user.name); // Display the registered name
                if (!toastShown.current) { // Ensure the toast is shown only once
                    toast.success(`Welcome back, ${user.name}!`,{ autoClose: 5000 });
                    toastShown.current = true;
                }
                return;
            }

            setIsRegistered(false);
        } catch (error) {
            console.error("Error checking registration status:", error.message || error);
            toast.error("Error checking registration status.",{ autoClose: 5000 });
        }
    };

    const handleRegister = async () => {
        if (!userName) {
            toast.error("Name is required.",{ autoClose: 5000 });
            return;
        }

        try {
            const { signer } = await connectWallet();
            const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);

            console.log(`Registering with name: ${userName}`);
            const tx = await contract.registerUser(userName);
            await tx.wait();

            toast.success("User registered successfully!",{ autoClose: 5000 });
            setIsRegistered(true);
            setAccountName(userName); // Update UI with the registered name
        } catch (error) {
            console.error("Error during registration:", error.message || error);
            toast.error("Error during registration. Please try again.",{ autoClose: 5000 });
        }
    };

    useEffect(() => {
        checkRegistration();
    }, []);

    return (
        <div style={styles.container}>
            <h3 style={styles.header}>User Registration</h3>
            {isRegistered ? (
                <p style={styles.success}>
                    Welcome, <strong>{accountName}</strong>! Your account is registered.
                </p>
            ) : (
                <div style={styles.registerContainer}>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        style={styles.input}
                    />
                    <button onClick={handleRegister} style={styles.button}>
                        Register
                    </button>
                </div>
            )}
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
    success: {
        color: "#28a745",
        fontWeight: "bold",
    },
    registerContainer: {
        marginTop: "10px",
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
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
};

export default RegisterUser;
