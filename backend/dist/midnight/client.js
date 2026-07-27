import fs from 'node:fs';
import path from 'node:path';
import pino from 'pino';
import { fileURLToPath } from 'node:url';
import { resolveNetwork } from '../wallet/network.js';
const logger = pino();
// Try to load network config from root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_FILE = path.resolve(__dirname, '../../../.midnight-state.json');
export function getNetworkConfig() {
    return resolveNetwork().config;
}
export function getContractAddress() {
    const configuredAddress = process.env.MIDNIGHT_CONTRACT_ADDRESS?.trim();
    if (configuredAddress)
        return configuredAddress;
    try {
        const raw = fs.readFileSync(STATE_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        const network = parsed?.activeNetwork;
        const address = network ? parsed?.deployments?.[network]?.address : undefined;
        if (!address) {
            throw new Error(`No deployment found for active network: ${network ?? 'unknown'}`);
        }
        return address;
    }
    catch (err) {
        logger.error('Failed to load a contract address. Set MIDNIGHT_CONTRACT_ADDRESS or deploy to the active network.');
        throw err;
    }
}
