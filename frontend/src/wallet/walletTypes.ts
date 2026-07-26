export interface WalletState {
  isConnected: boolean;
  address: string | null;
  network: string | null;
  error: Error | null;
  isConnecting: boolean;
  isMissing: boolean;
}

export interface MidnightWalletApi {
  getNetworkId(): Promise<number>;
  getUsedAddresses(): Promise<string[]>;
  getUnusedAddresses(): Promise<string[]>;
  getChangeAddress(): Promise<string>;
  getRewardAddresses(): Promise<string[]>;
  getUtxos(): Promise<string[]>;
  getCollateral(): Promise<string[]>;
  signTx(tx: string, partialSign: boolean): Promise<string>;
  signData(addr: string, payload: string): Promise<any>;
  submitTx(tx: string): Promise<string>;
}

export interface MidnightDAppConnector {
  name: string;
  version: string;
  enable(): Promise<MidnightWalletApi>;
  isEnabled(): Promise<boolean>;
}

declare global {
  interface Window {
    midnight?: {
      mnLace?: MidnightDAppConnector;
      [key: string]: any;
    };
  }
}
