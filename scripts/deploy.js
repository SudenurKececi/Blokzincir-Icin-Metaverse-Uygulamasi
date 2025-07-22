const hre = require("hardhat");

async function main() {
  
  const AssetStorage = await hre.ethers.getContractFactory("AssetStorage");
  const assetStorage = await AssetStorage.deploy();
  await assetStorage.waitForDeployment();
  const address = await assetStorage.getAddress();
  console.log("✅ Deployed to:", address);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
