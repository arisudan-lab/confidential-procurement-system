import { WalletContext } from '../wallet/wallet.js';
import { getNetworkConfig } from '../midnight/client.js';
import { MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';

export function createProviders(walletCtx: WalletContext): MidnightProviders<any, any> {
  const config = getNetworkConfig();

    const zkConfigProvider = {
      getZkConfig: async (contractName: string, circuitName: string) => {
        const url = new URL(`../../../contracts/managed/${contractName}/zkir/${circuitName}.zkir`, import.meta.url).href;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load ${url}`);
        return new Uint8Array(await response.arrayBuffer());
      }
    } as any;

    const walletProvider = {
      getCoinPublicKey: () => walletCtx.shieldedSecretKeys.coinPublicKey,
      getEncryptionPublicKey: () => walletCtx.shieldedSecretKeys.encryptionPublicKey,
      async balanceTx(tx: any, ttl?: Date) {
        return (walletCtx.wallet as any).balanceTransaction(tx, walletCtx.shieldedSecretKeys.coinPublicKey, ttl);
      }
    };

    return {
      privateStateProvider: levelPrivateStateProvider({
        privateStateStoreName: 'backend-private-state',
        accountId: 'backend',
        privateStoragePasswordProvider: async () => 'backend-secret'
      }),
      publicDataProvider: indexerPublicDataProvider(
        config.indexer,
        config.indexerWS
      ),
      zkConfigProvider,
      proofProvider: httpClientProofProvider(config.proofServer, zkConfigProvider as any),
      walletProvider,
      midnightProvider: (walletCtx.wallet as any).midnightProvider
    } as any;
}
