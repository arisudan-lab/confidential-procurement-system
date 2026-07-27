import { createWallet, WalletContext } from './wallet.js';
import { getNetworkConfig } from '../midnight/client.js';
import { NetworkId } from './network.js';
import pino from 'pino';

const logger = pino();

let globalWalletCtx: WalletContext | null = null;

export async function initWallet(): Promise<WalletContext> {
  const config = getNetworkConfig();
  
  const seed = config.networkId === 'undeployed'
    ? '0000000000000000000000000000000000000000000000000000000000000001'
    : process.env.MIDNIGHT_WALLET_SEED?.trim();
  if (!seed) {
    throw new Error('MIDNIGHT_WALLET_SEED is required when the backend runs against preview or preprod.');
  }

  logger.info(`Creating backend wallet on ${config.networkId}...`);
  globalWalletCtx = await createWallet({
    network: config.networkId as NetworkId,
    networkConfig: config as any,
    seed
  });

  logger.info('Waiting for wallet sync...');
  await globalWalletCtx.wallet.waitForSyncedState();
  logger.info('Backend wallet synced successfully.');

  return globalWalletCtx;
}

export function getWallet(): WalletContext {
  if (!globalWalletCtx) {
    throw new Error('Wallet not initialized');
  }
  return globalWalletCtx;
}
