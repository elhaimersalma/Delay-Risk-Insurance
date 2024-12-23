const DelayInsurance = artifacts.require("DelayInsurance");

module.exports = function (deployer) {
  deployer.deploy(DelayInsurance);
};
