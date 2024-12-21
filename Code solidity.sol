// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title AssuranceRetard
 * @dev Contrat pour gérer une assurance de risque retard, permettant aux utilisateurs
 * de recevoir une compensation en cas de retard dépassant un seuil défini.
 */
contract AssuranceRetard {

    // Structure pour définir un service
    struct Service {
        string nom;               // Nom du service (ex: Train, Vol, etc.)
        address compagnie;        // Adresse de la compagnie gérant le service
        uint compensation;        // Montant de la compensation (en wei)
        uint seuilRetard;         // Seuil de retard (en minutes)
        bool existe;              // Indique si le service est enregistré
    }

    // Structure pour les déclarations de retard
    struct DeclarationRetard {
        uint serviceId;           // ID du service concerné
        uint retardDeclare;       // Retard déclaré (en minutes)
        bool estCompense;         // Statut de la compensation
    }

    // Adresse du propriétaire du contrat
    address public owner;
    // Nombre total de services enregistrés
    uint public totalServices;
    // Mapping des services par leur ID
    mapping(uint => Service) public services;
    // Mapping des déclarations de retard pour chaque utilisateur
    mapping(address => DeclarationRetard[]) public declarations;

    // Événements pour journaliser les actions
    event ServiceEnregistre(uint serviceId, string nom, address compagnie, uint compensation);
    event RetardDeclare(address utilisateur, uint serviceId, uint retardDeclare);
    event CompensationPayee(address utilisateur, uint montant);

    // Modificateur pour restreindre l'accès au propriétaire
    modifier seulementProprietaire() {
        require(msg.sender == owner, "Seul le proprietaire peut effectuer cette action");
        _;
    }

    // Modificateur pour vérifier si un service existe
    modifier serviceExiste(uint serviceId) {
        require(services[serviceId].existe, "Le service n'existe pas");
        _;
    }

    // Constructeur du contrat
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Permet au propriétaire d'enregistrer un nouveau service.
     * @param nom Le nom du service (ex: Vol AirFrance).
     * @param compensation Le montant de la compensation en wei.
     * @param seuilRetard Le seuil de retard en minutes.
     */
    function enregistrerService(string memory nom, uint compensation, uint seuilRetard) public seulementProprietaire {
        require(compensation > 0, "La compensation doit etre superieure a 0");
        require(seuilRetard > 0, "Le seuil de retard doit etre superieur a 0");

        totalServices++;
        services[totalServices] = Service({
            nom: nom,
            compagnie: msg.sender,
            compensation: compensation,
            seuilRetard: seuilRetard,
            existe: true
        });

        emit ServiceEnregistre(totalServices, nom, msg.sender, compensation);
    }

    /**
     * @dev Permet à un utilisateur de déclarer un retard.
     * @param serviceId L'identifiant du service concerné.
     * @param retardDeclare Le retard déclaré en minutes.
     */
    function declarerRetard(uint serviceId, uint retardDeclare) public serviceExiste(serviceId) {
        require(retardDeclare > 0, "Le retard declare doit etre superieur a 0");

        Service memory service = services[serviceId];
        require(retardDeclare >= service.seuilRetard, "Le retard declare est inferieur au seuil");

        declarations[msg.sender].push(DeclarationRetard({
            serviceId: serviceId,
            retardDeclare: retardDeclare,
            estCompense: false
        }));

        emit RetardDeclare(msg.sender, serviceId, retardDeclare);
    }

    /**
     * @dev Permet à un utilisateur de recevoir une compensation si applicable.
     * @param serviceId L'identifiant du service concerné.
     */
    function compenserRetard(uint serviceId) public serviceExiste(serviceId) {
        DeclarationRetard[] storage utilisateurDeclarations = declarations[msg.sender];
        uint montantTotal = 0;

        for (uint i = 0; i < utilisateurDeclarations.length; i++) {
            if (!utilisateurDeclarations[i].estCompense && utilisateurDeclarations[i].serviceId == serviceId) {
                montantTotal += services[serviceId].compensation;
                utilisateurDeclarations[i].estCompense = true;
            }
        }

        require(montantTotal > 0, "Aucune compensation n'est due");
        payable(msg.sender).transfer(montantTotal);

        emit CompensationPayee(msg.sender, montantTotal);
    }

    /**
     * @dev Permet au propriétaire d'ajouter des fonds au contrat pour payer les compensations.
     */
    function financerContrat() public payable seulementProprietaire {
        require(msg.value > 0, "Le montant doit etre superieur a 0");
    }

    /**
     * @dev Retourne le solde du contrat.
     */
    function soldeContrat() public view returns (uint) {
        return address(this).balance;
    }

    /**
     * @dev Permet au propriétaire de retirer les fonds restants.
     */
    function retirerFonds() public seulementProprietaire {
        payable(owner).transfer(address(this).balance);
    }
}

