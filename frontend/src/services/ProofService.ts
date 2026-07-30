/**
 * ProofService — utilities for ZK proof lifecycle in the browser.
 *
 * In the Midnight DApp architecture, proof generation is delegated to the
 * user's Lace wallet via `getProvingProvider()`.  This service wraps the
 * wallet's proving capabilities and provides helpers for the UI to track
 * proof generation status.
 */
import { midnightClient } from '../midnight/MidnightClient';
import type { ProvingProvider, KeyMaterialProvider } from '@midnight-ntwrk/dapp-connector-api';

export type ProofStatus = 'idle' | 'generating' | 'verifying' | 'complete' | 'failed';

export class ProofService {
  private static provingProvider: ProvingProvider | null = null;

  /**
   * Obtain the proving provider from the connected wallet.
   * The wallet may use a local or remote proof server depending
   * on the user's configuration.
   */
  static async getProvider(keyMaterialProvider: KeyMaterialProvider): Promise<ProvingProvider> {
    if (this.provingProvider) return this.provingProvider;

    if (!midnightClient.isConnected) {
      throw new Error('Wallet not connected. Cannot obtain proving provider.');
    }

    this.provingProvider = await midnightClient.getProvingProvider(keyMaterialProvider);
    return this.provingProvider;
  }

  /**
   * Generate a ZK proof for a given circuit preimage.
   *
   * @param preimage   — serialized circuit preimage bytes
   * @param keyLocation — circuit key identifier (e.g. "submitBid")
   * @returns The proof as a Uint8Array
   */
  static async prove(preimage: Uint8Array, keyLocation: string): Promise<Uint8Array> {
    if (!this.provingProvider) {
      throw new Error('Proving provider not initialized. Call getProvider() first.');
    }

    return this.provingProvider.prove(preimage, keyLocation);
  }

  /**
   * Verify a proof against a circuit preimage.
   *
   * @param preimage   — serialized circuit preimage bytes
   * @param keyLocation — circuit key identifier
   * @returns Array of public output values (undefined if witness slot)
   */
  static async verify(preimage: Uint8Array, keyLocation: string): Promise<(bigint | undefined)[]> {
    if (!this.provingProvider) {
      throw new Error('Proving provider not initialized. Call getProvider() first.');
    }

    return this.provingProvider.check(preimage, keyLocation);
  }

  /** Reset cached provider (e.g. on wallet disconnect). */
  static reset(): void {
    this.provingProvider = null;
  }
}
