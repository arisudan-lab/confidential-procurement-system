import { MidnightConfig } from './Config';

export function expectedNetworkId(): string {
  return MidnightConfig.networkId;
}

export function isExpectedNetwork(networkId: string): boolean {
  return networkId === expectedNetworkId();
}
