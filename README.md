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

## Étapes d'installation détaillées

### Étape 1 : Cloner le projet

1. Ouvrez un terminal et exécutez :
   ```bash
   git clone <URL_DU_REPOSITORY>
   cd assurance-risque-retard
   ```

2. Installez les dépendances nécessaires :
   ```bash
   npm install
   ```

### Étape 2 : Configurer Ganache

1. Lancez Ganache.
2. Créez un nouveau projet ou utilisez l'option "Quickstart Ethereum".
3. Notez les informations du réseau local (exemple : RPC Server `http://127.0.0.1:7545`).
4. Copiez une clé privée d'un compte généré par Ganache pour l'utiliser avec MetaMask.

### Étape 3 : Configurer MetaMask

1. Ajoutez un nouveau réseau personnalisé dans MetaMask :
   - Nom du réseau : Ganache Local
   - RPC URL : `http://127.0.0.1:7545`
   - ID de chaîne : 1337 (ou celui généré par Ganache).
2. Importez la clé privée copiée depuis Ganache pour tester les transactions.

### Étape 4 : Compiler et déployer les smart contracts

1. Compilez les contrats avec Truffle :
   ```bash
   truffle compile
   ```
   - Cela génère des fichiers ABI (Application Binary Interface) pour interagir avec les contrats.

2. Déployez les contrats sur Ganache :
   ```bash
   truffle migrate
   ```
   - Assurez-vous que Ganache est en cours d'exécution avant de lancer cette commande.

### Étape 5 : Tester les smart contracts

1. Exécutez les tests inclus dans le projet :
   ```bash
   truffle test
   ```
   - Vérifiez que toutes les fonctionnalités fonctionnent comme prévu.

---

## Interagir avec le contrat

### Méthodes principales :

1. **Enregistrer un service** (Propriétaire uniquement) :
   - Fonction : `enregistrerService(string nom, uint compensation, uint seuilRetard)`.
   - Exemple :
     ```javascript
     await contract.enregistrerService("Train SNCF", 1000000000000000000, 30);
     ```

2. **Déclarer un retard** :
   - Fonction : `declarerRetard(uint serviceId, uint retardDeclare)`.
   - Exemple :
     ```javascript
     await contract.declarerRetard(1, 45);
     ```

3. **Recevoir une compensation** :
   - Fonction : `compenserRetard(uint serviceId)`.
   - Exemple :
     ```javascript
     await contract.compenserRetard(1);
     ```

---

## Déploiement sur un réseau de test Ethereum

### Étape 1 : Configurer un réseau de test (Rinkeby ou Goerli)

1. Obtenez des Ethers de test via un faucet.
2. Modifiez le fichier `truffle-config.js` pour inclure la configuration du réseau de test.

### Étape 2 : Déployer sur le réseau de test

1. Exécutez la commande suivante :
   ```bash
   truffle migrate --network rinkeby
   ```

2. Vérifiez le déploiement via un explorateur blockchain comme Etherscan.

---

## Fonctionnement étape par étape

1. **Propriétaire** :
   - Enregistre les services avec leurs seuils et montants de compensation.
2. **Utilisateur** :
   - Déclare un retard via la DApp ou directement sur la blockchain.
   - Reçoit automatiquement une compensation si les critères sont remplis.
3. **Propriétaire** :
   - Peut ajouter des fonds au contrat pour garantir les paiements.

---

## Ressources utiles

- [Documentation Solidity](https://docs.soliditylang.org/)
- [Truffle Suite](https://trufflesuite.com/)
- [Ganache](https://trufflesuite.com/ganache/)
- [MetaMask](https://metamask.io/)

---

## Auteur

**Salma** - Développement de la DApp d'assurance retard. N'hésitez pas à me contacter pour toute question ou support.
