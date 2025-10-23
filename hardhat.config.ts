import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";

module.exports = {
  //Ensures that the helpers and integrations from the Viem plugin are available
  plugins: [hardhatToolboxViemPlugin],
  networks: {
    besu: {
      type: "http",
      url: process.env.HOST_URL!, // RPC of your Besu node
      accounts: [
        process.env.ALLOC_1_PRIVATE_KEY!, 
        process.env.ALLOC_2_PRIVATE_KEY!, 
        process.env.ALLOC_3_PRIVATE_KEY!
      ] // From genesis.json
    }
  },
  solidity: { 
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      }
    }
  }
};


