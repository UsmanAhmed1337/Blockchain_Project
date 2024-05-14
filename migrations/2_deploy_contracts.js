const PatientRecords = artifacts.require("PatientRecords");
const SupplyChain = artifacts.require("SupplyChain");
const Billing = artifacts.require("Billing");

module.exports = function(deployer) {
  deployer.deploy(PatientRecords);
  deployer.deploy(SupplyChain);
  deployer.deploy(Billing, '0xf2043bE2D5258BD632E6D10cE2B63B6bDE5f3B0E'); 
}
