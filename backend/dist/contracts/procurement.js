import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { getContractAddress } from '../midnight/client.js';
import { createProviders } from './providers.js';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';
import pino from 'pino';
const logger = pino();
let contractInterface = null;
let activeContractAddress = null;
let currentProviders = null;
let currentCompiledContract = null;
export async function initializeContract(walletCtx) {
    const address = getContractAddress();
    activeContractAddress = address;
    // Resolve path to the compiled artifacts
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    // Since we are in dist/contracts/, contracts/ is at ../../../../contracts/
    const contractPath = path.resolve(__dirname, '../../../../contracts/managed/procurement/contract/index.mjs');
    const zkConfigPath = path.resolve(__dirname, '../../../../contracts/managed/procurement/zkir');
    // Load the dynamic ESM module
    let Procurement;
    try {
        Procurement = await import(pathToFileURL(contractPath).href);
    }
    catch (err) {
        logger.error(`Failed to load contract from ${contractPath}. Have you compiled it?`);
        throw err;
    }
    currentProviders = createProviders(walletCtx);
    // Re-create the CompiledContract using the imported class and dummy witnesses for backend
    currentCompiledContract = CompiledContract.make('procurement', Procurement.Contract).pipe(CompiledContract.withWitnesses({
        getSupplier: (ctx) => [ctx.privateState, new Uint8Array(32)],
        getBidAmount: (ctx) => [ctx.privateState, 0n],
        getSecret: (ctx) => [ctx.privateState, new Uint8Array(32)],
        getNonce: (ctx) => [ctx.privateState, new Uint8Array(32)],
    }), CompiledContract.withCompiledFileAssets(zkConfigPath));
    contractInterface = {
    // Expose helpers for the API endpoints to use
    // Since backend does not actually have user's local secrets, it will act as a relay or just view state
    // For transactions, we'd need their proofs or we'd construct them on backend using our own witness logic
    // e.g. a view helper to check current status
    };
    logger.info(`Contract initialized targeting address: ${address}`);
}
export function getContract() {
    if (!contractInterface)
        throw new Error('Contract not initialized');
    return {
        address: activeContractAddress,
        providers: currentProviders,
        compiledContract: currentCompiledContract
    };
}
