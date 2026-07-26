export interface WalletState {
  isConnected: boolean;
  address: string | null;
  network: string | null;
  error: Error | null;
  isConnecting: boolean;
  isMissing: boolean;
}
