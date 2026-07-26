import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { getContractAddress } from '../midnight/client.js';
import { WalletContext } from '../wallet/wallet.js';
import { createProviders } from './providers.js';
import { ContractAddress } from '@midnight-ntwrk/compact-runtime';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import pino from 'pino';

const logger = pino();
let contractInterface: any = null;
let activeContractAddress: string | null = null;
let currentProviders: any = null;
let currentCompiledContract: any = null;

export async function initializeContract(walletCtx: WalletContext) {
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
  } catch (err) {
    logger.error(`Failed to load contract from ${contractPath}. Have you compiled it?`);
    throw err;
  }

  currentProviders = createProviders(walletCtx);

  // Re-create the CompiledContract using the imported class and dummy witnesses for backend
  currentCompiledContract = CompiledContract.make('procurement', Procurement.Contract).pipe(
    (CompiledContract as any).withWitnesses({
      getSupplier: (ctx: any) => [ctx.privateState, new Uint8Array(32)],
      getBidAmount: (ctx: any) => [ctx.privateState, 0n],
      getSecret: (ctx: any) => [ctx.privateState, new Uint8Array(32)],
      getNonce: (ctx: any) => [ctx.privateState, new Uint8Array(32)],
    }),
    (CompiledContract as any).withCompiledFileAssets(zkConfigPath)
  );

  contractInterface = {
    // Expose helpers for the API endpoints to use
    // Since backend does not actually have user's local secrets, it will act as a relay or just view state
    // For transactions, we'd need their proofs or we'd construct them on backend using our own witness logic
    
    // e.g. a view helper to check current status
  };

  logger.info(`Contract initialized targeting address: ${address}`);
}

export function getContract() {
  if (!contractInterface) throw new Error('Contract not initialized');
  return {
    address: activeContractAddress,
    providers: currentProviders,
    compiledContract: currentCompiledContract
  };
}

export async function getBidCount(): Promise<string> {
  if (!currentProviders || !activeContractAddress) throw new Error('Contract not initialized');
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const contractPath = path.resolve(__dirname, '../../../../contracts/managed/procurement/contract/index.mjs');
  let Procurement = await import(pathToFileURL(contractPath).href);
  
  const contractState = await currentProviders.publicDataProvider.queryContractState(activeContractAddress);
  if (!contractState) return "0";
  
  const ledgerState = Procurement.ledger(contractState.data);
  return ledgerState.bidCount.toString();
}

export async function submitBidContract(supplier: Uint8Array, amount: bigint, secret: Uint8Array, nonce: Uint8Array) {
  if (!currentProviders || !activeContractAddress) throw new Error('Contract not initialized');
  
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const contractPath = path.resolve(__dirname, '../../../../contracts/managed/procurement/contract/index.mjs');
  const zkConfigPath = path.resolve(__dirname, '../../../../contracts/managed/procurement/zkir');

  let Procurement = await import(pathToFileURL(contractPath).href);

  const configuredContract = CompiledContract.make('procurement', Procurement.Contract).pipe(
    (CompiledContract as any).withWitnesses({
      getSupplier: (ctx: any) => [ctx.privateState, supplier],
      getBidAmount: (ctx: any) => [ctx.privateState, amount],
      getSecret: (ctx: any) => [ctx.privateState, secret],
      getNonce: (ctx: any) => [ctx.privateState, nonce],
    }),
    (CompiledContract as any).withCompiledFileAssets(zkConfigPath)
  );

  const contract = await findDeployedContract(currentProviders, activeContractAddress, configuredContract);
  const tx = await contract.tx.submitBid();
  return tx;
}
