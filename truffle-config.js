const path = require("path");
var HDWalletProvider = require("@truffle/hdwallet-provider");
// Add the deployer private key here in order to deploy the contract to Rinkeby
var pk = "";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    rinkeby: {
      provider: function() { 
       // Rinkeby infura api with api key 
       return new HDWalletProvider([pk], "https://rinkeby.infura.io/v3/9e4b116dae024763ace39129ac330cdd");
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
  }
  },
  compilers: {
    solc: {
      version: "0.6.0"
  }
}};
