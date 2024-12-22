# Créer un fichier README.md avec les codes pour Truffle et les instructions d'interaction
readme_content = """
# Delay Insurance DApp - Truffle Tests and Interaction Guide

## Description
This file provides step-by-step instructions and code snippets for testing and interacting with the Delay Insurance smart contract using Truffle.

---

## Truffle Test Script

### File: `test/DelayInsurance.test.js`
```javascript
const DelayInsurance = artifacts.require("DelayInsurance");

contract("DelayInsurance", (accounts) => {
  const admin = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];

  it("should register a user", async () => {
    const instance = await DelayInsurance.deployed();
    await instance.registerUser("Alice", { from: user1 });
    const user = await instance.users(user1);
    assert.equal(user.name, "Alice", "User registration failed");
  });

  it("should submit a claim", async () => {
    const instance = await DelayInsurance.deployed();
    await instance.submitClaim(500, 30, { from: user1 });
    const claim = await instance.claims(0);
    assert.equal(claim.amount.toString(), "500", "Claim amount mismatch");
  });

  it("should approve a claim", async () => {
    const instance = await DelayInsurance.deployed();
    // Fund the contract
    await web3.eth.sendTransaction({
      from: admin,
      to: instance.address,
      value: web3.utils.toWei("1", "ether"),
    });

    await instance.approveClaim(0, { from: admin });
    const claim = await instance.claims(0);
    assert.equal(claim.isPaid, true, "Claim approval failed");
  });
});
