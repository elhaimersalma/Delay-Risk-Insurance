
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
```

---

## Interaction with Ganache Accounts

### Using Truffle Console

1. **Start the Truffle console:**
   ```bash
   truffle console --network development
   ```

2. **Deploy the contract:**
   ```bash
   migrate --reset
   ```

3. **Register a user:**
   ```javascript
   await contract.registerUser("Alice", { from: "0x6A67A9dFC41FbF5E267D1B0f2D8fE9E8E5E5A0Dd" });
   ```

4. **Submit a claim:**
   ```javascript
   await contract.submitClaim(500, 30, { from: "0x6A67A9dFC41FbF5E267D1B0f2D8fE9E8E5E5A0Dd" });
   ```

5. **Fund the contract:**
   ```javascript
   await web3.eth.sendTransaction({ from: "0x8Cd3a0783492e0ad6Fc3a64007751f4108093498", to: contract.address, value: web3.utils.toWei("100", "ether") });
   ```

6. **Approve a claim:**
   ```javascript
   await contract.approveClaim(0, { from: "0x8Cd3a0783492e0ad6Fc3a64007751f4108093498" });
   ```

7. **Check the claim details:**
   ```javascript
   const claim = await contract.claims(0);
   console.log({ user: claim.user, amount: claim.amount.toString(), isPaid: claim.isPaid, delayTime: claim.delayTime.toString() });
   ```

---

## Ethereum Addresses for Testing

- **Admin Account:** `0x8Cd3a0783492e0ad6Fc3a64007751f4108093498`
- **User Account 1:** `0x6A67A9dFC41FbF5E267D1B0f2D8fE9E8E5E5A0Dd`
- **User Account 2:** `0x5E3560E2E2A58cAeF7E81fECDE948D7E6c7e8e53`

Ensure these accounts are funded in Ganache.

---

## Running Tests

1. Run the test suite:
   ```bash
   truffle test
   ```

2. Verify the results in the terminal.

---

## Contact

- **Developer:** Salma
- **Email:** salma.email@example.com
