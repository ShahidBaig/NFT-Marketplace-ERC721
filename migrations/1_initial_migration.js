const Migrations = artifacts.require("Migrations");

module.exports = function (deployer) {
  deployer.deploy(Migrations); //, {gas: 4612388, from: "0xfE0238470AeFe5015033de8791EaDa64612ed021"});
};
