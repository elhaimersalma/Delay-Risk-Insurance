# Assurance de Risque Retard

## Description
This project aims to address the recurring issue of delays in the railway network by providing a decentralized application (DApp) built on the Ethereum blockchain. The application ensures automated, transparent, and reliable compensation for users impacted by service delays, eliminating bureaucracy and inefficiencies in traditional systems.

## Key Features
- **Automated Compensation:** Smart contracts handle the compensation process without human intervention.
- **Transparency:** Blockchain technology guarantees traceability and prevents data tampering.
- **Simplified Claims Process:** A user-friendly interface allows passengers to easily file and manage delay claims.

---

## Functional Overview
1. **User Registration and Management:**
   - Users create accounts via the DApp and register train services with details such as ID, departure/arrival times, and delay claims.

2. **Delay Evaluation:**
   - Smart contracts evaluate delays against predefined thresholds.

3. **Automated Payments:**
   - If the delay exceeds the threshold, the smart contract triggers a payment in Ether to the user's wallet.

4. **Monitoring and Reporting:**
   - Users can track their claims, payment statuses, and service history via dashboards.

5. **Administrative Controls:**
   - Administrators can update delay thresholds and compensation rules as required.

---

## Technologies Used
- **Blockchain:** Ethereum (Ganache for development)
- **Programming Language:** Solidity
- **Frontend:** HTML, CSS, JavaScript
- **Blockchain Interaction:** Web3.js
- **Smart Contract Testing:** Truffle
- **Crypto Wallet Integration:** MetaMask

---

## Architecture
1. **Frontend:**
   - User interface for passengers and administrators.

2. **Backend:**
   - Ethereum smart contracts for processing claims and managing compensation.

3. **Blockchain:**
   - Immutable ledger for storing service and transaction data.

---

## Installation and Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/assurance-risque-retard.git
   cd assurance-risque-retard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start Ganache:
   ```bash
   ganache-cli
   ```

4. Deploy the smart contracts:
   ```bash
   truffle migrate --network development
   ```

5. Start the frontend:
   ```bash
   npm start
   ```

---

## Usage
1. Register as a user and log in.
2. Add train service details (ID, scheduled times, etc.).
3. Submit a delay claim if applicable.
4. Monitor claim status and receive compensation directly in Ether.

---

## Contributing
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

---

## Authors
- **Mohamed Dalouh**
- **Salma Elhaimer**
- **Adam Hassouni**
- **Anas Ouakili**

---

## Acknowledgments
Special thanks to **Mr. Anass Zaidouni** for his guidance and support during the development of this project.

---

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.
