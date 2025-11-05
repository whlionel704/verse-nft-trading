import { network } from "hardhat";
import fs from "fs";
import { performance } from "perf_hooks";

const TX_COUNT = 5; // Number of transactions to send
const VALUE = 1n;     // Amount in wei

async function main() {
  const { viem } = await network.connect({
    network: "besu",
    chainType: "eip155",
  });

  const publicClient = await viem.getPublicClient();
  const [senderClient, receiverClient] = await viem.getWalletClients();

  const sender = senderClient.account.address;
  const receiver = receiverClient.account.address;

  console.log(`Sending ${TX_COUNT} transactions from ${sender} to ${receiver}`);

  const results = [];

  for (let i = 0; i < TX_COUNT; i++) {
    const start = performance.now();

    const txHash = await senderClient.sendTransaction({
      to: receiver,
      value: VALUE,
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

    const end = performance.now();
    const latencyMs = end - start;

    results.push({
      txHash,
      blockNumber: receipt.blockNumber.toString(),
      gasUsed: receipt.gasUsed.toString(),
      latencyMs: latencyMs.toFixed(2),
    });

    console.log(`Tx ${i + 1}/${TX_COUNT} | Hash: ${txHash} | Latency: ${latencyMs.toFixed(2)} ms`);
  }

  // Save results to file
  fs.writeFileSync("results/tx-metrics.json", 
    JSON.stringify(results, (_, value) =>
      typeof value === "bigint" ? value.toString() : value,
      2
    )
  );
  console.log("✅ All transactions sent and recorded.");
}

main().catch((err) => {
  console.error("❌ Error sending transactions:", err);
  process.exit(1);
});