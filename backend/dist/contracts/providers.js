import { getNetworkConfig } from '../midnight/client.js';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
export function createProviders(walletCtx) {
    const config = getNetworkConfig();
    const zkConfigProvider = {
        getZkConfig: async (contractName, circuitName) => {
            const url = new URL(`../../../contracts/managed/${contractName}/zkir/${circuitName}.zkir`, import.meta.url).href;
            const response = await fetch(url);
            if (!response.ok)
                throw new Error(`Failed to load ${url}`);
            return new Uint8Array(await response.arrayBuffer());
        }
    };
    const walletProvider = {
        getCoinPublicKey: () => walletCtx.shieldedSecretKeys.coinPublicKey,
        getEncryptionPublicKey: () => walletCtx.shieldedSecretKeys.encryptionPublicKey,
        async balanceTx(tx, ttl) {
            return walletCtx.wallet.balanceTransaction(tx, walletCtx.shieldedSecretKeys.coinPublicKey, ttl);
        }
    };
    return {
        privateStateProvider: levelPrivateStateProvider({
            privateStateStoreName: 'backend-private-state',
            accountId: 'backend',
            privateStoragePasswordProvider: async () => 'backend-secret'
        }),
        publicDataProvider: indexerPublicDataProvider(config.indexer, config.indexerWS),
        zkConfigProvider,
        proofProvider: httpClientProofProvider(config.proofServer, zkConfigProvider),
        walletProvider,
        midnightProvider: walletCtx.wallet.midnightProvider
    };
}
