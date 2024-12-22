
# Assurance de Risque Retard - DApp

Ce projet est une application décentralisée (DApp) permettant de compenser les utilisateurs en cas de retard d'un service (vol, train, etc.) en utilisant des smart contracts sur la blockchain Ethereum.

---

## Fonctionnalités principales

- Enregistrement des utilisateurs.
- Soumission de réclamations pour des retards.
- Compensation automatique en Ether après approbation des réclamations.
- Gestion des fonds du contrat.

---

## Prérequis

Avant de commencer, assurez-vous d'avoir les outils et logiciels suivants :

1. **Node.js** :
   - Téléchargez et installez Node.js depuis [nodejs.org](https://nodejs.org/).
   - Vérifiez l'installation avec la commande suivante :
     ```bash
     node -v
     npm -v
     ```

2. **Truffle** :
   - Installez le framework Truffle globalement :
     ```bash
     npm install -g truffle
     ```
   - Vérifiez l'installation avec :
     ```bash
     truffle version
     ```

3. **Ganache** :
   - Téléchargez Ganache depuis [le site officiel](https://trufflesuite.com/ganache/) et installez-le.
   - Ganache simule une blockchain Ethereum localement pour tester les smart contracts.

4. **MetaMask** :
   - Installez l'extension MetaMask dans votre navigateur depuis [metamask.io](https://metamask.io/).
   - Configurez un portefeuille Ethereum et connectez-le à Ganache (voir plus bas).

5. **Solidity** :
   - Assurez-vous que Truffle utilise la version 0.8.x de Solidity (compatible avec ce projet).

6. **NPM ou Yarn** :
   - Ces gestionnaires de packages sont inclus avec Node.js et permettent d'installer les dépendances.

---

## Étapes d'installation

### 1. Initialiser le projet Truffle
1. Créez un nouveau dossier pour votre projet.
   ```bash
   mkdir DelayInsurance
   cd DelayInsurance
   ```
2. Initialisez un projet Truffle.
   ```bash
   truffle init
   ```

### 2. Ajouter le smart contract
1. Allez dans le dossier `contracts/` et créez un fichier pour le contrat principal.
   ```bash
   echo. > contracts\DelayInsurance.sol
   ```
2. Copiez le code Solidity dans ce fichier.

### 3. Configurer Truffle
1. Ouvrez le fichier `truffle-config.js` et configurez le réseau Ganache local :
   ```javascript
   module.exports = {
     networks: {
       development: {
         host: "127.0.0.1", // Adresse locale de Ganache
         port: 7545,        // Port par défaut de Ganache
         network_id: "*",  // Match tous les réseaux
       },
     },
     compilers: {
       solc: {
         version: "0.8.0", // Version de Solidity
       },
     },
   };
   ```

### 4. Compiler les smart contracts
1. Compilez le contrat pour générer les fichiers ABI.
   ```bash
   truffle compile
   ```

### 5. Déployer les smart contracts
1. Ajoutez un script de migration dans le dossier `migrations/`. Créez un fichier `2_deploy_contracts.js` :
   ```bash
   echo. > migrations\2_deploy_delay_insurance.js
   ```
2. Ajoutez le contenu suivant :
   ```javascript
   const DelayInsurance = artifacts.require("DelayInsurance");

   module.exports = function (deployer) {
     deployer.deploy(DelayInsurance);
   };
   ```
3. Déployez le contrat sur Ganache :
   ```bash
   truffle migrate --network development
   ```

---

## Comptes Ethereum pour Tests

Voici les adresses Ethereum pour les tests locaux :

- **Admin Account :** `0x8Cd3a0783492e0ad6Fc3a64007751f4108093498`
- **User Account 1 :** `0x6A67A9dFC41FbF5E267D1B0f2D8fE9E8E5E5A0Dd`
- **User Account 2 :** `0x5E3560E2E2A58cAeF7E81fECDE948D7E6c7e8e53`

---

## Interagir avec le contrat

### Utilisation de la console Truffle
1. Lancez une console Truffle pour interagir avec le contrat déployé.
   ```bash
   truffle console
   ```
2. Chargez le contrat déployé dans la console :
   ```javascript
   let instance = await DelayInsurance.deployed();
   ```
3. Appelez les fonctions pour vérifier le fonctionnement :
   - Enregistrer un utilisateur :
     ```javascript
     await instance.registerUser("Alice", { from: "0x6A67A9dFC41FbF5E267D1B0f2D8fE9E8E5E5A0Dd" });
     ```
   - Soumettre une réclamation :
     ```javascript
     await instance.submitClaim(500, 30, { from: "0x6A67A9dFC41FbF5E267D1B0f2D8fE9E8E5E5A0Dd" });
     ```
   - Approver une réclamation :
     ```javascript
     await instance.approveClaim(0, { from: "0x8Cd3a0783492e0ad6Fc3a64007751f4108093498" });
     ```
   - Vérifier une réclamation :
     ```javascript
     const claim = await instance.claims(0);
     console.log({
       user: claim.user,
       amount: claim.amount.toString(),
       isPaid: claim.isPaid,
       delayTime: claim.delayTime.toString()
     });
     ```

---

## Tests et déploiement

### Tests unitaires
1. Ajoutez des tests dans le dossier `test/` pour valider les fonctionnalités.
2. Exemple de test en JavaScript :
   ```javascript
   const DelayInsurance = artifacts.require("DelayInsurance");

   contract("DelayInsurance", (accounts) => {
     it("should register a user", async () => {
       const instance = await DelayInsurance.deployed();
       await instance.registerUser("Alice", { from: accounts[0] });
       const user = await instance.users(accounts[0]);
       assert.equal(user.name, "Alice", "User registration failed");
     });
   });
   ```

---

## Ressources utiles

- [Documentation Solidity](https://docs.soliditylang.org/)
- [Truffle Suite](https://trufflesuite.com/)
- [Ganache](https://trufflesuite.com/ganache/)
- [MetaMask](https://metamask.io/)

