import app from './app.js';
import { initWallet } from './wallet/manager.js';
import { initializeContract } from './contracts/procurement.js';
import pino from 'pino';
const logger = pino();
const PORT = process.env.PORT || 3001;
async function bootstrap() {
    logger.info('Starting Confidential Procurement System Backend...');
    try {
        // 1. Initialize Wallet (Connects to Node & Indexer, registers DUST)
        logger.info('Initializing Midnight Wallet...');
        const walletCtx = await initWallet();
        // 2. Initialize Contract (Loads deployed contract address & artifacts)
        logger.info('Initializing Procurement Contract Interface...');
        await initializeContract(walletCtx);
        app.listen(PORT, () => {
            logger.info(`Backend API server running on port ${PORT}`);
        });
    }
    catch (error) {
        logger.error({ err: error }, 'Failed to bootstrap backend application');
        process.exit(1);
    }
}
bootstrap();
