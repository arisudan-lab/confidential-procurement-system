/**
 * WalletService — exposes wallet state and operations for UI components
 * that need wallet data without going through React context.
 *
 * Wraps both the LaceWallet (raw DApp Connector API) and the
 * MidnightClient (provider-level operations) into a single,
 * stateless service layer.
 */
import { laceWallet } from '../wallet/LaceWallet';
import { midnightClient } from '../midnight/MidnightClient';
import { ContractService } from './ContractService';

export interface WalletInfo {
  address: string;
  network: string;
  isConnected: boolean;
  balances: {
    shielded: Record<string, bigint>;
    unshielded: Record<string, bigint>;
    dust: { balance: bigint; cap: bigint };
  } | null;
}

export class WalletService {
  /**
   * Check whether the Midnight Lace wallet extension is installed.
   */
  static async isWalletAvailable(): Promise<boolean> {
    return laceWallet.isAvailable();
  }

  /**
   * Connect to the Lace wallet and initialize the MidnightClient.
   * Returns the connected wallet info.
   */
  static async connect(): Promise<WalletInfo> {
    const api = await laceWallet.connect();
    const config = await api.getConfiguration();
    const { unshieldedAddress } = await api.getUnshieldedAddress();

    // Also initialize the MidnightClient for L2 operations
    if (!midnightClient.isConnected) {
      await midnightClient.connect();
    }

    return {
      address: unshieldedAddress,
      network: config.networkId,
      isConnected: true,
      balances: null, // fetched lazily
    };
  }

  /**
   * Disconnect from the wallet and reset all service state.
   */
  static disconnect(): void {
    midnightClient.disconnect();
    ContractService.reset();
  }

  /**
   * Get the user's wallet address.
   */
  static async getAddress(): Promise<string> {
    return laceWallet.getAddress();
  }

  /**
   * Get the network the wallet is connected to.
   */
  static async getNetwork(): Promise<string> {
    return laceWallet.getNetwork();
  }

  /**
   * Fetch full wallet balances from the connected wallet.
   */
  static async getBalances(): Promise<WalletInfo['balances']> {
    const api = await laceWallet.connect();
    const [shielded, unshielded, dust] = await Promise.all([
      api.getShieldedBalances(),
      api.getUnshieldedBalances(),
      api.getDustBalance(),
    ]);

    return { shielded, unshielded, dust };
  }
}
