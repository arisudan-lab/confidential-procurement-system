import { createWallet } from './wallet.js';
import { getNetworkConfig } from '../midnight/client.js';
import pino from 'pino';
const logger = pino();
let globalWalletCtx = null;
export async function initWallet() {
    const config = getNetworkConfig();
    // Use genesis seed for local devnet backend wallet
    const seed = '0000000000000000000000000000000000000000000000000000000000000001';
    logger.info(`Creating backend wallet on ${config.networkId}...`);
    globalWalletCtx = await createWallet({
        network: config.networkId,
        networkConfig: config,
        seed
    });
    logger.info('Waiting for wallet sync...');
    await globalWalletCtx.wallet.waitForSyncedState();
    logger.info('Backend wallet synced successfully.');
    return globalWalletCtx;
}
export function getWallet() {
    if (!globalWalletCtx) {
        throw new Error('Wallet not initialized');
    }
    return globalWalletCtx;
}
