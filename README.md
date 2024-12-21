# Assurance de Risque Retard - DApp

Ce projet est une application décentralisée (DApp) permettant de compenser les utilisateurs en cas de retard d'un service (vol, train, etc.) en utilisant des smart contracts sur la blockchain Ethereum.

## Fonctionnalités principales

- Enregistrement de services (compagnies, seuils de retard, montants de compensation).
- Déclaration de retard par les utilisateurs.
- Compensation automatique en Ether en cas de dépassement du seuil de retard.
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
   mkdir assurance-risque-retard
   cd assurance-risque-retard
   ```
2. Initialisez un projet Truffle.
   ```bash
   truffle init
   ```

### 2. Ajouter le smart contract
1. Allez dans le dossier `contracts/` et créez un fichier pour le contrat principal.
   ```bash
   touch contracts/AssuranceRetard.sol
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
         version: "0.8.x", // Version de Solidity
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
   touch migrations/2_deploy_contracts.js
   ```
2. Ajoutez le contenu suivant :
   ```javascript
   const AssuranceRetard = artifacts.require("AssuranceRetard");

   module.exports = function (deployer) {
     deployer.deploy(AssuranceRetard);
   };
   ```
3. Déployez le contrat sur Ganache :
   ```bash
   truffle migrate
   ```

---

## Interagir avec le contrat

### Utilisation de la console Truffle
1. Lancez une console Truffle pour interagir avec le contrat déployé.
   ```bash
   truffle console
   ```
2. Chargez le contrat déployé dans la console :
   ```javascript
   let instance = await AssuranceRetard.deployed();
   ```
3. Appelez les fonctions pour vérifier le fonctionnement :
   - Enregistrer un service :
     ```javascript
     await instance.enregistrerService("Train SNCF", web3.utils.toWei("1", "ether"), 30, { from: "0xAdresseCompteGanache" });
     ```
   - Déclarer un retard :
     ```javascript
     await instance.declarerRetard(1, 45, { from: "0xAdresseUtilisateur" });
     ```
   - Recevoir une compensation :
     ```javascript
     await instance.compenserRetard(1, { from: "0xAdresseUtilisateur" });
     ```

---

## Développement frontend

1. Configurez un frontend avec HTML, CSS, et JavaScript.
2. Utilisez **Web3.js** pour connecter votre interface au contrat déployé.
   - Exemple d'initialisation de Web3 :
     ```javascript
     const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
     const contract = new web3.eth.Contract(ABI, "AdresseDuContrat");
     ```

---

## Tests et déploiement

### Tests unitaires
1. Ajoutez des tests dans le dossier `test/` pour valider les fonctionnalités.
2. Exemple de test en JavaScript :
   ```javascript
   const AssuranceRetard = artifacts.require("AssuranceRetard");

   contract("AssuranceRetard", (accounts) => {
     it("devrait enregistrer un service", async () => {
       const instance = await AssuranceRetard.deployed();
       await instance.enregistrerService("Train SNCF", 1000, 30, { from: accounts[0] });
       const service = await instance.services(1);
       assert.equal(service.nom, "Train SNCF", "Le service n'est pas enregistré correctement");
     });
   });
   ```

### Déploiement sur un réseau de test Ethereum
1. Configurez un réseau de test (Rinkeby ou Goerli) dans `truffle-config.js`.
2. Déployez avec :
   ```bash
   truffle migrate --network rinkeby
   ```

---

## Ressources utiles

- [Documentation Solidity](https://docs.soliditylang.org/)
- [Truffle Suite](https://trufflesuite.com/)
- [Ganache](https://trufflesuite.com/ganache/)
- [MetaMask](https://metamask.io/)

---
