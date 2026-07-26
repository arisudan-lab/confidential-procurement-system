import '@midnight-ntwrk/dapp-connector-api';
import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';

export class LaceWallet {
  private api: ConnectedAPI | null = null;

  async isAvailable(): Promise<boolean> {
    return typeof window !== 'undefined' && !!window.midnight?.mnLace;
  }

  async isEnabled(): Promise<boolean> {
    return localStorage.getItem('midnight_lace_connected') === 'true';
  }

  async connect(): Promise<ConnectedAPI> {
    if (!await this.isAvailable()) {
      throw new Error('Lace wallet extension is not installed');
    }

    try {
      this.api = await window.midnight!.mnLace!.connect('undeployed');
      localStorage.setItem('midnight_lace_connected', 'true');
      return this.api;
    } catch (error: any) {
      localStorage.removeItem('midnight_lace_connected');
      if (error.message && error.message.includes('user rejected')) {
        throw new Error('Connection rejected by user');
      }
      throw error;
    }
  }

  async getAddress(): Promise<string> {
    if (!this.api) throw new Error('Wallet not connected');
    const { unshieldedAddress } = await this.api.getUnshieldedAddress();
    return unshieldedAddress;
  }

  async getNetwork(): Promise<string> {
    if (!this.api) throw new Error('Wallet not connected');
    const config = await this.api.getConfiguration();
    return config.networkId;
  }

  disconnect() {
    this.api = null;
    localStorage.removeItem('midnight_lace_connected');
  }
}

export const laceWallet = new LaceWallet();
