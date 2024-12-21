// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AssuranceRetard {

    struct Service {
        string nom;
        address compagnie;
        uint compensation; // Montant à compenser en wei
        uint seuilRetard; // Retard minimum en minutes pour compensation
        bool existe;
    }

    struct DeclarationRetard {
        uint serviceId;
        uint retardDeclare;
        bool estCompense;
    }

    address public owner;
    uint public totalServices;
    mapping(uint => Service) public services;
    mapping(address => DeclarationRetard[]) public declarations;

    event ServiceEnregistre(uint serviceId, string nom, address compagnie, uint compensation);
    event RetardDeclare(address utilisateur, uint serviceId, uint retardDeclare);
    event CompensationPayee(address utilisateur, uint montant);

    modifier seulementProprietaire() {
        require(msg.sender == owner, "Seul le proprietaire peut effectuer cette action");
        _;
    }

    modifier serviceExiste(uint serviceId) {
        require(services[serviceId].existe, "Le service n'existe pas");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

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

    function financerContrat() public payable seulementProprietaire {
        require(msg.value > 0, "Le montant doit etre superieur a 0");
    }

    function soldeContrat() public view returns (uint) {
        return address(this).balance;
    }
}
