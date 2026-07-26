import fs from 'node:fs';
import path from 'node:path';
import pino from 'pino';
import { fileURLToPath } from 'node:url';
const logger = pino();
// Try to load network config from root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_FILE = path.resolve(__dirname, '../../../../.midnight-state.json');
export function getNetworkConfig() {
    // Hardcoded for local devnet for now
    return {
        networkId: 'undeployed',
        indexer: 'http://127.0.0.1:8088/api/v4/graphql',
        indexerWS: 'ws://127.0.0.1:8088/api/v4/graphql/ws',
        node: 'ws://127.0.0.1:9944',
        proofServer: 'http://127.0.0.1:6300',
        faucet: 'http://127.0.0.1:8081/devnet/faucet/send-test-tokens',
        composeServices: {
            "node": "http://127.0.0.1:9933",
            "proof-server": "http://127.0.0.1:6300"
        }
    };
}
export function getContractAddress() {
    try {
        const raw = fs.readFileSync(STATE_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        const address = parsed?.deployments?.undeployed?.address;
        if (!address) {
            throw new Error('No deployment found for undeployed network');
        }
        return address;
    }
    catch (err) {
        logger.error('Failed to load contract address from .midnight-state.json. Ensure the contract is deployed.');
        throw err;
    }
}
