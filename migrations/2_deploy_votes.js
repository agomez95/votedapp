const VotesContract = artifacts.require("VotesContract");

module.exports = function (deployer) {
  deployer.deploy(VotesContract);
};
