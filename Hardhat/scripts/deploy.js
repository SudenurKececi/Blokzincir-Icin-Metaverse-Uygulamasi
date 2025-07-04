const hre = require("hardhat");

async function main() {
  // 1) Factory’yi alın
  const AssetStorage = await hre.ethers.getContractFactory("AssetStorage");
  // 2) Deploy edin
  const assetStorage = await AssetStorage.deploy();
  // 3) ethers v6’da deploy’u beklemek için:
  await assetStorage.waitForDeployment();
  // 4) Adresi alın (ethers v6’da getAddress()):
  const address = await assetStorage.getAddress();
  console.log("✅ Deployed to:", address);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
