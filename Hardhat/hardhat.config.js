require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  defaultNetwork: "localhost",       
  solidity: "0.8.18",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"       
      // accounts belirtmeye gerek yok; node otomatik olarak 20 hesap sunar
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/4S5IBhBvD3_q7aL9CC5GL9et6I7eNqlY",
      accounts: ["0x64b9a90a6a6208df85b07d895f90c7f9bfc599d6b606cbecddaa5a64efe96933"]
    }
  }
};
