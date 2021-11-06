var Tutorial = artifacts.require("./Tutorial.sol");
var TutorialManager = artifacts.require("./TutorialManager.sol");

module.exports = function (deployer) {
  deployer.deploy(TutorialManager);
};
