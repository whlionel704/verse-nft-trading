import { abi, bytecode } from 'blockchain/utils/viem.util.js';
import dotenv from 'dotenv';
import { network } from 'hardhat'
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

dotenv.config();

async function deployVerseNft() {
  //This instantiates the connection to the Besu node
  const { viem } = await network.connect({
    network: "besu",
    chainType: "eip155",
  });

  //The public client connects to the besu node
  const publicClient = await viem.getPublicClient();

  //The wallet client is used to deploy the contract - FOR LOCAL BESU ONLY
  // const [walletClient] = await viem.getWalletClients();
  // console.log(walletClient)

  const account = privateKeyToAccount(`0x${process.env.ALLOC_1_PRIVATE_KEY!}`)
  const walletClient = createWalletClient({
    account,
    transport: http(process.env.HOST_URL!)
  });
  
  const hash = await walletClient.deployContract({
    abi,
    bytecode,
    args: [account.address, 'Verse_Nft', 'VNFT'],
    chain: undefined
  });

  console.log('Deployment transaction hash:', hash);

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log('Verse_Nft contract deployed at the following address:', receipt.contractAddress);
  console.log('Block number:', receipt.blockNumber);
  console.log('✅ Deployment successful');
}

deployVerseNft().catch((err) => {
  console.error('❌ Deployment failed:', err);
});

