const ArtToken = artifacts.require("ArtToken");
const ArtMarketplace = artifacts.require("ArtMarketplace");

module.exports = async function(deployer) {
  await deployer.deploy(ArtToken); //, {gas: 4612388, from: "0xfE0238470AeFe5015033de8791EaDa64612ed021"});

  const token = await ArtToken.deployed()

  await deployer.deploy(ArtMarketplace, token.address)

  const market = await ArtMarketplace.deployed()

  await token.setMarketplace(market.address)
};
