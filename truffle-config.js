require('babel-register');
require('babel-polyfill');

const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = "soup blue parrot multiply harsh choice fluid moment run plug seek leave";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777" // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/c2d6c679423c4df6ae451a161dd74da2")
      },
      network_id: 3
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "0.5.16",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
