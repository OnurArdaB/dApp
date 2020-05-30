const Penguin = artifacts.require("Penguin");

module.exports = function(deployer) {
  deployer.deploy(Penguin);
};