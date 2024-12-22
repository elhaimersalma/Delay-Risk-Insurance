const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
const contractAddress = "0xb479Dc60EaF32bf643116ee541d76B2b30b8a051";
const contractABI = [/* Replace with your contract ABI */];

const contract = new web3.eth.Contract(contractABI, contractAddress);

document.addEventListener("DOMContentLoaded", () => {
  // Register User
  document.getElementById("register")?.addEventListener("click", async () => {
    const userName = document.getElementById("userName").value;
    const accounts = await web3.eth.requestAccounts();
    await contract.methods.registerUser(userName).send({ from: accounts[0] });
    alert("Utilisateur enregistré avec succès !");
  });

  // Submit Claim
  document.getElementById("submitClaim")?.addEventListener("click", async () => {
    const amount = document.getElementById("claimAmount").value;
    const delayTime = document.getElementById("delayTime").value;
    const accounts = await web3.eth.requestAccounts();
    await contract.methods.submitClaim(web3.utils.toWei(amount, "ether"), delayTime).send({ from: accounts[0] });
    alert("Réclamation soumise avec succès !");
  });

  // Approve Claim
  document.getElementById("approveClaim")?.addEventListener("click", async () => {
    const claimId = document.getElementById("claimId").value;
    const accounts = await web3.eth.requestAccounts();
    await contract.methods.approveClaim(claimId).send({ from: accounts[0] });
    alert(`Réclamation ${claimId} approuvée avec succès !`);
  });

  // Check Claim
  document.getElementById("checkClaim")?.addEventListener("click", async () => {
    const claimId = document.getElementById("checkClaimId").value;
    const claim = await contract.methods.claims(claimId).call();
    document.getElementById("claimDetails").innerHTML = `
      <p><strong>Utilisateur :</strong> ${claim.user}</p>
      <p><strong>Montant :</strong> ${web3.utils.fromWei(claim.amount, "ether")} ETH</p>
      <p><strong>Status :</strong> ${claim.isPaid ? "Payé" : "En attente"}</p>
      <p><strong>Temps de Retard :</strong> ${claim.delayTime} minutes</p>
    `;
  });
});
