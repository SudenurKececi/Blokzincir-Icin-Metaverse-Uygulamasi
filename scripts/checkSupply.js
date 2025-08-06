// scripts/checkSupply.js

async function main() {
  // 1) Hardhat ortamından ethers’i al
  const { ethers } = require("hardhat");

  // 2) Kontratınızın Solidity’deki adıyla eşleşmeli:
  const Factory = await ethers.getContractFactory("AssetStorage");
  console.log("✅ ContractFactory hazır");

  // 3) Deploy ettiğiniz adrese bağlanın
  const ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; 
  const nft = Factory.attach(ADDRESS);
  console.log("✅ Attached to:", ADDRESS);

  // 4) totalSupply()’ı çağırın
  const supplyBN = await nft.totalSupply();
  console.log("🏷 totalSupply =", supplyBN.toString());
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error("❌ Hata:", err);
    process.exit(1);
  });
