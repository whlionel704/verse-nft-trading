import dotenv from 'dotenv';
import { network } from 'hardhat'
import { readFileSync } from 'node:fs';
import path from 'node:path';

dotenv.config();

async function deployVerseNft() {

  //Load ABI and Bytecode from Hardhat artifacts
  const contractName = 'Verse_Nft';
  const artifactPath = path.join(
    './',
    'blockchain',
    'artifacts',
    'blockchain',
    'contracts',
    `${contractName}.sol`,
    `${contractName}.json`
  );

  const artifact = JSON.parse(readFileSync(artifactPath, 'utf8'));
  const abi = artifact.abi;
  const bytecode = artifact.bytecode;

  //This instantiates the connection to the Besu node
  const { viem } = await network.connect({
    network: "besu",
    chainType: "eip155",
  });

  //The public client connects to the besu node
  const publicClient = await viem.getPublicClient();

  //The wallet client is used to deploy the contract
  const [walletClient] = await viem.getWalletClients();

  const hash = await walletClient.deployContract({
    abi,
    bytecode,
    args: [walletClient.account.address, 'Verse_Nft', 'VNFT'], // Add constructor arguments if needed
  });

  console.log('Deployment transaction hash:', hash);

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log('Verse_Nft contract deployed at:', receipt.contractAddress);
  console.log('Block number:', receipt.blockNumber);
  console.log('✅ Deployment successful');
}

deployVerseNft().catch((err) => {
  console.error('❌ Deployment failed:', err);
});

