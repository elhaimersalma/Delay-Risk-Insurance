
# Assurance de Risque Retard - Interface ONCF

Ce fichier README explique comment exécuter et tester l'interface de votre DApp **Assurance de Risque Retard - ONCF** dans **VS Code**.

---

## Prérequis

1. **VS Code** :
   - Téléchargez et installez Visual Studio Code depuis [code.visualstudio.com](https://code.visualstudio.com/).

2. **Live Server** :
   - Installez l'extension **Live Server** dans VS Code :
     - Ouvrez **Extensions** (Ctrl + Shift + X).
     - Recherchez **Live Server** et cliquez sur **Install**.

3. **Node.js** :
   - Téléchargez et installez Node.js depuis [nodejs.org](https://nodejs.org/).
   - Vérifiez l'installation :
     ```bash
     node -v
     npm -v
     ```

4. **Ganache** :
   - Téléchargez Ganache depuis [trufflesuite.com/ganache](https://trufflesuite.com/ganache/) et lancez-le.

5. **MetaMask** :
   - Installez l'extension MetaMask dans votre navigateur depuis [metamask.io](https://metamask.io/).

---

## Étapes pour Exécuter l'Interface

### Étape 1 : Déployez le Contrat
1. Lancez Ganache et créez un nouveau projet.
2. Dans le terminal intégré de VS Code, naviguez dans le dossier du projet et exécutez :
   ```bash
   truffle migrate --reset --network development
   ```
3. Notez l’adresse du contrat affichée (par exemple : `0xb479Dc60EaF32bf643116ee541d76B2b30b8a051`).
4. Ouvrez le fichier **`app.js`** et remplacez l’adresse du contrat :
   ```javascript
   const contractAddress = "0xb479Dc60EaF32bf643116ee541d76B2b30b8a051";
   ```

### Étape 2 : Lancez Live Server
1. Ouvrez le fichier **`index.html`** dans VS Code.
2. Faites un clic droit sur le fichier et sélectionnez **"Open with Live Server"**.
3. Votre navigateur s'ouvrira à l'adresse suivante :
   ```
   http://127.0.0.1:5500/
   ```

---

## Configurer MetaMask

### Étape 1 : Ajouter le Réseau Ganache
1. Ouvrez MetaMask et cliquez sur votre profil en haut à droite.
2. Allez dans **Settings > Networks > Add Network**.
3. Remplissez les détails suivants :
   - **Nom** : Ganache
   - **RPC URL** : `http://127.0.0.1:7545`
   - **Chain ID** : `1337`

4. Cliquez sur **Save**.

### Étape 2 : Importer un Compte Ganache
1. Dans Ganache, copiez la clé privée d’un compte.
2. Dans MetaMask, sélectionnez **Import Account** et collez la clé privée.

---

## Utilisation de l'Interface

1. **Page d'Accueil (`index.html`)** :
   - Naviguez entre les fonctionnalités :
     - **Enregistrer un utilisateur**
     - **Soumettre une réclamation**
     - **Panel administrateur**

2. **Enregistrer un Utilisateur (`register.html`)** :
   - Entrez un nom d'utilisateur et cliquez sur **S'enregistrer**.

3. **Soumettre une Réclamation (`claim.html`)** :
   - Entrez un montant et une durée de retard, puis cliquez sur **Soumettre**.

4. **Panel Administrateur (`admin.html`)** :
   - Approvez une réclamation ou vérifiez son statut.

---

## Débogage

1. **Logs MetaMask** :
   - Vérifiez les transactions dans l'historique de MetaMask.

2. **Console du Navigateur** :
   - Ouvrez **F12 > Console** pour voir les erreurs JavaScript.

3. **Truffle Console** :
   - Testez directement avec Truffle :
     ```bash
     truffle console
     let claim = await contract.methods.claims(0).call();
     console.log(claim);
     ```

---

## Améliorations Futures

- Héberger la DApp sur **Netlify**, **Vercel**, ou **GitHub Pages**.
- Ajouter des graphiques pour visualiser les réclamations et paiements.

