import type { MidnightWalletApi } from './walletTypes';

export class LaceWallet {
  private api: MidnightWalletApi | null = null;

  async isAvailable(): Promise<boolean> {
    return typeof window !== 'undefined' && !!window.midnight?.mnLace;
  }

  async isEnabled(): Promise<boolean> {
    if (!await this.isAvailable()) return false;
    return await window.midnight!.mnLace!.isEnabled();
  }

  async connect(): Promise<MidnightWalletApi> {
    if (!await this.isAvailable()) {
      throw new Error('Lace wallet extension is not installed');
    }

    try {
      this.api = await window.midnight!.mnLace!.enable();
      return this.api;
    } catch (error: any) {
      if (error.message && error.message.includes('user rejected')) {
        throw new Error('Connection rejected by user');
      }
      throw error;
    }
  }

  async getAddress(): Promise<string> {
    if (!this.api) throw new Error('Wallet not connected');
    const addresses = await this.api.getUsedAddresses();
    if (addresses.length === 0) {
      const unused = await this.api.getUnusedAddresses();
      if (unused.length === 0) throw new Error('No addresses found');
      return unused[0];
    }
    return addresses[0];
  }

  async getNetwork(): Promise<string> {
    if (!this.api) throw new Error('Wallet not connected');
    const networkId = await this.api.getNetworkId();
    return networkId === 1 ? 'Mainnet' : 'Testnet';
  }

  disconnect() {
    this.api = null;
    // Real wallet disconnection is usually handled by the user in the extension,
    // but we can clear our local state.
  }
}

export const laceWallet = new LaceWallet();
