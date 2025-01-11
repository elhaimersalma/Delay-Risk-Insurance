import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ethers } from "ethers";
import connectWallet from "./utils/connectWallet";
import UserDashboard from "./components/User/UserDashboard";
import AdminDashboard from "./components/Admin/AdminDashboard";
import contractABI from "./contract/DelayInsurance.json";

const contractAddress = "0x5037413dAD9058f93d37ba4e751500AAFdF70ae3";

function App() {
    const [role, setRole] = useState(null);

    useEffect(() => {
        const fetchRole = async () => {
            const { signer } = await connectWallet();
            const address = await signer.getAddress();

            // Determine the role based on the address
            const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);
            const adminAddress = await contract.admin();
            if (address.toLowerCase() === adminAddress.toLowerCase()) {
                setRole("admin");
            } else {
                setRole("user");
            }
        };

        fetchRole();
    }, []);

    if (role === null) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <Routes>
                {role === "admin" ? (
                    <>
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="*" element={<Navigate to="/admin" />} />
                    </>
                ) : (
                    <>
                        <Route path="/user" element={<UserDashboard />} />
                        <Route path="*" element={<Navigate to="/user" />} />
                    </>
                )}
            </Routes>
        </Router>
    );
}

export default App;
