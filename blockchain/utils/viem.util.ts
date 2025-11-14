import { readFileSync } from 'node:fs';
import path from 'node:path';
import * as dotenv from "dotenv";
dotenv.config();

//QBFT Chain configuration for viem public client creation
export const qbftChain = {
    id: 1337,
    name: "Local QBFT Besu",
    network: "qbft",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: { default: { http: [process.env.HOST_URL!] } },
};

//Artifact data for contract deployment and interaction
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

export const abi = artifact.abi;
export const bytecode = artifact.bytecode;