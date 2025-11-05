import { privateKeyToAccount } from 'viem/accounts';

const privateKey = '0xYOUR_PRIVATE_KEY'; // include the 0x prefix
const account = privateKeyToAccount(privateKey);

console.log('Public Key:', account.publicKey); // uncompressed public key (starts with 0x04)