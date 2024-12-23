module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Adresse locale de Ganache
      port: 7545,       // Port par défaut de Ganache
      network_id: "*"   // Match tous les réseaux
    }
  },
  compilers: {
    solc: {
      version: "0.8.0" // Version de Solidity
    }
  }
};
