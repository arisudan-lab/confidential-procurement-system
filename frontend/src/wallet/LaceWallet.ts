import '@midnight-ntwrk/dapp-connector-api';
import type { ConnectedAPI, InitialAPI } from '@midnight-ntwrk/dapp-connector-api';
import { expectedNetworkId } from '../midnight/Network';

export class LaceWallet {
  private api: ConnectedAPI | null = null;

  private isShutdownError(error: unknown): boolean {
    return error instanceof Error && /RemoteApiShutdownError|was shutdown|object can no longer be used/i.test(error.message);
  }

  private provider(): InitialAPI | null {
    if (typeof window === 'undefined') return null;
    const wallets = Object.values(window.midnight ?? {});
    return window.midnight?.mnLace ?? wallets.find((wallet) => /lace|1am/i.test(wallet.name)) ?? wallets[0] ?? null;
  }

  async isAvailable(): Promise<boolean> {
    return this.provider() !== null;
  }

  async isEnabled(): Promise<boolean> {
    // A connector API is invalid after an extension reload. Do not call a
    // remembered remote object during application startup; connecting again
    // obtains a fresh channel from the injected wallet provider.
    return false;
  }

  async connect(): Promise<ConnectedAPI> {
    const provider = this.provider();
    if (!provider) {
      throw new Error('No Midnight wallet was detected. Install and unlock Lace or 1AM, then refresh this page.');
    }

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        // Never reuse a possibly stale object retained after the wallet
        // extension reloads or locks.
        this.api = await this.provider()!.connect(expectedNetworkId());
        await this.api.hintUsage(['getUnshieldedAddress', 'getConfiguration']);
        const status = await this.api.getConnectionStatus();
        if (status.status !== 'connected' || status.networkId !== expectedNetworkId()) {
          this.api = null;
          throw new Error(`Wallet is connected to ${status.status === 'connected' ? status.networkId : 'no network'}, expected ${expectedNetworkId()}.`);
        }
        localStorage.setItem('midnight_lace_connected', 'true');
        return this.api;
      } catch (error) {
        this.api = null;
        if (attempt === 0 && this.isShutdownError(error)) continue;
        localStorage.removeItem('midnight_lace_connected');
        if (error instanceof Error && /reject|declin|denied/i.test(error.message)) {
          throw new Error('Connection rejected by user');
        }
        if (this.isShutdownError(error)) {
          throw new Error('The wallet extension reloaded or was locked. Unlock it, refresh the page, and connect again.');
        }
        throw error;
      }
    }
    throw new Error('Unable to establish a wallet connection.');
  }

  async getAddress(): Promise<string> {
    if (!this.api) throw new Error('Wallet not connected');
    try {
      const { unshieldedAddress } = await this.api.getUnshieldedAddress();
      return unshieldedAddress;
    } catch (error) {
      if (this.isShutdownError(error)) this.disconnect();
      throw error;
    }
  }

  async getNetwork(): Promise<string> {
    if (!this.api) throw new Error('Wallet not connected');
    try {
      const config = await this.api.getConfiguration();
      return config.networkId;
    } catch (error) {
      if (this.isShutdownError(error)) this.disconnect();
      throw error;
    }
  }

  disconnect() {
    this.api = null;
    localStorage.removeItem('midnight_lace_connected');
  }
}

export const laceWallet = new LaceWallet();
