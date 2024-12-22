// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DelayInsurance {
    // Structure pour stocker les informations des réclamations
    struct Claim {
        address user;       // Adresse de l'utilisateur
        uint256 amount;     // Montant réclamé
        bool isPaid;        // Indique si la réclamation a été payée
        uint256 delayTime;  // Temps de retard en minutes
    }

    // Structure pour les utilisateurs
    struct User {
        string name;        // Nom de l'utilisateur
        address wallet;     // Adresse Ethereum
    }

    // Mapping pour stocker les utilisateurs
    mapping(address => User) public users;

    // Mapping pour stocker les réclamations
    mapping(uint256 => Claim) public claims;
    uint256 public claimCounter; // Compteur pour les réclamations

    // Événements pour suivre les actions
    event UserRegistered(address indexed user, string name);
    event ClaimSubmitted(uint256 indexed claimId, address indexed user, uint256 amount);
    event ClaimApproved(uint256 indexed claimId, address indexed user, uint256 amount);
    event ClaimRejected(uint256 indexed claimId, address indexed user, string reason);

    // Fonction pour enregistrer un utilisateur
    function registerUser(string memory _name) public {
        require(bytes(_name).length > 0, "Nom invalide");
        require(users[msg.sender].wallet == address(0), "Utilisateur deja enregistre");


        users[msg.sender] = User(_name, msg.sender);
        emit UserRegistered(msg.sender, _name);
    }

    // Fonction pour soumettre une réclamation
    function submitClaim(uint256 _amount, uint256 _delayTime) public {
        require(users[msg.sender].wallet != address(0), "Utilisateur non enregistre");
        require(_amount > 0, "Montant invalide");
        require(_delayTime > 0, "Temps de retard invalide");

        claims[claimCounter] = Claim(msg.sender, _amount, false, _delayTime);
        emit ClaimSubmitted(claimCounter, msg.sender, _amount);
        claimCounter++;
    }

    // Fonction pour approuver une réclamation
    function approveClaim(uint256 _claimId) public {
        Claim storage claim = claims[_claimId];
        require(claim.user != address(0), "Reclamation inexistante");
        require(!claim.isPaid, "Reclamation deja payee");
        require(address(this).balance >= claim.amount, "Solde du contrat insuffisant");

        claim.isPaid = true;
        payable(claim.user).transfer(claim.amount);
        emit ClaimApproved(_claimId, claim.user, claim.amount);
    }

    // Fonction pour rejeter une réclamation (optionnel)
    function rejectClaim(uint256 _claimId, string memory _reason) public {
        Claim storage claim = claims[_claimId];
        require(claim.user != address(0), "Reclamation inexistante");
        require(!claim.isPaid, "Reclamation deja payee");

        delete claims[_claimId];
        emit ClaimRejected(_claimId, claim.user, _reason);
    }

    // Fonction pour déposer des fonds dans le contrat
    function fundContract() public payable {
        require(msg.value > 0, "Montant de financement invalide");
    }

    // Fonction pour vérifier le solde du contrat
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Fonction pour recevoir des fonds (fallback)
    receive() external payable {}
}
