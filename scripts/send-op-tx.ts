import { network } from "hardhat";

const amount = 100000n;
const { viem } = await network.connect({
  network: "besu",
  chainType: "eip155",
});

console.log("Sending transaction using the OP chain type");

const publicClient = await viem.getPublicClient();
const [senderClient, receiverClient] = await viem.getWalletClients();

console.log(`Sending ${amount} wei from`, senderClient.account.address, "to", receiverClient.account.address);

const tx = await senderClient.sendTransaction({
  to: receiverClient.account.address,
  value: amount,
});

await publicClient.waitForTransactionReceipt({ hash: tx });

console.log("Transaction sent successfully");

const txDetails = await publicClient.getTransaction({ hash: tx });
console.log(`Transaction details: \n`, txDetails);


const senderBalance = await publicClient.getBalance({ address: senderClient.account.address });
console.log(`Balance of ${senderClient.account.address}: ${senderBalance} wei`);

const receiverBalance = await publicClient.getBalance({ address: receiverClient.account.address });
console.log(`Balance of ${receiverClient.account.address}: ${receiverBalance} wei`);
