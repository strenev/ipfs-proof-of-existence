var IPFSProofOfExistence = artifacts.require("./IPFSProofOfExistence.sol");
var IPFSProofOfExistenceTestable = artifacts.require("./IPFSProofOfExistenceTestable.sol");

module.exports = function (deployer, network) {
  deployer.deploy(IPFSProofOfExistence);
  
  if (network === "development") {
    deployer.deploy(IPFSProofOfExistenceTestable);
  }
};
