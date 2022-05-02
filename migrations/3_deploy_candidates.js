const CandidatesContract = artifacts.require("CandidatesContract");

module.exports = function (deployer) {
  deployer.deploy(CandidatesContract);
};
