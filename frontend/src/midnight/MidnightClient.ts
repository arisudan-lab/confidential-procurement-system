/**
 * MidnightClient — browser-side Midnight network client.
 *
 * Connects to the user's Lace wallet via the DApp Connector API, then
 * exposes the provider objects that the Midnight.js contract SDK requires
 * to find deployed contracts, generate ZK proofs, balance transactions,
 * and submit them to the Midnight Network.
 *
 * This is the genuine L2 integration layer — every transaction flows
 * through the user's own wallet, never through a backend proxy.
 */
import type { ConnectedAPI, Configuration, KeyMaterialProvider, ProvingProvider } from '@midnight-ntwrk/dapp-connector-api';
import { laceWallet } from '../wallet/LaceWallet';

/** Network endpoints discovered from the connected wallet. */
export interface NetworkConfig {
  indexerUri: string;
  indexerWsUri: string;
  proverServerUri: string | undefined;
  networkId: string;
}

/**
 * Provider bundle compatible with Midnight.js `findDeployedContract`.
 *
 * The Midnight.js SDK expects a providers object with:
 *   - walletProvider  (balanceTx / submitTx / keys)
 *   - publicDataProvider (indexer queries)
 *   - proofProvider (ZK proving)
 *   - zkConfigProvider (circuit ZKIR + keys)
 *
 * In a browser DApp the Lace wallet itself fulfils most of these roles
 * through the DApp Connector API (`balanceUnsealedTransaction`,
 * `submitTransaction`, `getProvingProvider`).
 */
export interface DAppProviders {
  walletProvider: {
    balanceTx: (tx: string) => Promise<{ tx: string }>;
    submitTx: (tx: string) => Promise<void>;
    getCoinPublicKey: () => Promise<string>;
  };
  publicDataProvider: {
    queryContractState: (address: string) => Promise<any>;
  };
  proofProvider: ProvingProvider | null;
  networkConfig: NetworkConfig;
}

export class MidnightClient {
  private connectedApi: ConnectedAPI | null = null;
  private config: Configuration | null = null;
  private provingProvider: ProvingProvider | null = null;

  /** Whether the client has a live connection to the wallet. */
  get isConnected(): boolean {
    return this.connectedApi !== null;
  }

  /** The network configuration obtained from the wallet. */
  get networkConfig(): NetworkConfig | null {
    if (!this.config) return null;
    return {
      indexerUri: this.config.indexerUri,
      indexerWsUri: this.config.indexerWsUri,
      proverServerUri: this.config.proverServerUri,
      networkId: this.config.networkId,
    };
  }

  /**
   * Connect to the user's Midnight Lace wallet and discover network
   * configuration.  The wallet will prompt the user for authorisation
   * if this is the first time connecting.
   */
  async connect(): Promise<NetworkConfig> {
    // Delegate connection to LaceWallet (handles retry / error mapping)
    this.connectedApi = await laceWallet.connect();

    // Discover the network endpoints the wallet is configured with
    this.config = await this.connectedApi.getConfiguration();

    // Hint that we will use proving, balancing & submission
    await this.connectedApi.hintUsage([
      'getProvingProvider',
      'balanceUnsealedTransaction',
      'submitTransaction',
      'getUnshieldedAddress',
      'getShieldedAddresses',
    ]);

    return {
      indexerUri: this.config.indexerUri,
      indexerWsUri: this.config.indexerWsUri,
      proverServerUri: this.config.proverServerUri,
      networkId: this.config.networkId,
    };
  }

  /**
   * Build a KeyMaterialProvider that fetches ZKIR + prover/verifier keys
   * from the proof server discovered via the wallet configuration.
   *
   * The `zkConfigBaseUrl` should point to the hosted proof-server assets
   * or a local endpoint serving the compiled ZKIR files.
   */
  buildKeyMaterialProvider(zkConfigBaseUrl: string): KeyMaterialProvider {
    return {
      async getZKIR(circuitKeyLocation: string): Promise<Uint8Array> {
        const url = `${zkConfigBaseUrl}/${circuitKeyLocation}.zkir`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch ZKIR from ${url}`);
        return new Uint8Array(await res.arrayBuffer());
      },
      async getProverKey(circuitKeyLocation: string): Promise<Uint8Array> {
        const url = `${zkConfigBaseUrl}/${circuitKeyLocation}.prover`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch prover key from ${url}`);
        return new Uint8Array(await res.arrayBuffer());
      },
      async getVerifierKey(circuitKeyLocation: string): Promise<Uint8Array> {
        const url = `${zkConfigBaseUrl}/${circuitKeyLocation}.verifier`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch verifier key from ${url}`);
        return new Uint8Array(await res.arrayBuffer());
      },
    };
  }

  /**
   * Obtain a ProvingProvider from the wallet.  The wallet may delegate
   * proving to its embedded proof server or a remote server, depending
   * on user configuration.
   */
  async getProvingProvider(keyMaterialProvider: KeyMaterialProvider): Promise<ProvingProvider> {
    if (!this.connectedApi) throw new Error('Wallet not connected');
    if (!this.provingProvider) {
      this.provingProvider = await this.connectedApi.getProvingProvider(keyMaterialProvider);
    }
    return this.provingProvider;
  }

  /**
   * Build the full provider bundle that Midnight.js's
   * `findDeployedContract` and `callTx.*` methods expect.
   */
  async buildProviders(zkConfigBaseUrl: string): Promise<DAppProviders> {
    if (!this.connectedApi || !this.config) {
      throw new Error('MidnightClient is not connected. Call connect() first.');
    }

    const api = this.connectedApi;
    const keyMaterialProvider = this.buildKeyMaterialProvider(zkConfigBaseUrl);
    const provingProvider = await this.getProvingProvider(keyMaterialProvider);

    return {
      walletProvider: {
        balanceTx: (tx: string) => api.balanceUnsealedTransaction(tx),
        submitTx: (tx: string) => api.submitTransaction(tx),
        getCoinPublicKey: async () => {
          const { shieldedCoinPublicKey } = await api.getShieldedAddresses();
          return shieldedCoinPublicKey;
        },
      },
      publicDataProvider: {
        queryContractState: async (address: string) => {
          // Use the indexer GraphQL endpoint to query contract state
          const query = `{ contractState(address: "${address}") { data } }`;
          const res = await fetch(this.config!.indexerUri, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
          });
          const json = await res.json();
          return json?.data?.contractState ?? null;
        },
      },
      proofProvider: provingProvider,
      networkConfig: {
        indexerUri: this.config.indexerUri,
        indexerWsUri: this.config.indexerWsUri,
        proverServerUri: this.config.proverServerUri,
        networkId: this.config.networkId,
      },
    };
  }

  /**
   * Balance an unsealed transaction through the user's wallet.
   * The wallet adds fee inputs/outputs and returns the balanced tx.
   */
  async balanceTransaction(unsealedTx: string): Promise<string> {
    if (!this.connectedApi) throw new Error('Wallet not connected');
    const result = await this.connectedApi.balanceUnsealedTransaction(unsealedTx);
    return result.tx;
  }

  /**
   * Submit a balanced, sealed transaction to the Midnight network
   * through the user's wallet (which acts as the relayer).
   */
  async submitTransaction(tx: string): Promise<void> {
    if (!this.connectedApi) throw new Error('Wallet not connected');
    await this.connectedApi.submitTransaction(tx);
  }

  /** Get the user's unshielded address from the connected wallet. */
  async getUnshieldedAddress(): Promise<string> {
    if (!this.connectedApi) throw new Error('Wallet not connected');
    const { unshieldedAddress } = await this.connectedApi.getUnshieldedAddress();
    return unshieldedAddress;
  }

  /** Disconnect from the wallet and release resources. */
  disconnect(): void {
    this.connectedApi = null;
    this.config = null;
    this.provingProvider = null;
    laceWallet.disconnect();
  }
}

/** Singleton instance for the entire frontend application. */
export const midnightClient = new MidnightClient();
