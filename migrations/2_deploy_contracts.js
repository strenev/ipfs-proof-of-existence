var IPFSProofOfExistence = artifacts.require("./IPFSProofOfExistence.sol");
//var IPFSProofOfExistenceTestable = artifacts.require("./IPFSProofOfExistenceTestable.sol");

module.exports = function(deployer) {
  deployer.deploy(IPFSProofOfExistence);
  //deployer.deploy(IPFSProofOfExistenceTestable);
};
