export const MidnightConfig = {
  networkId: import.meta.env.VITE_MIDNIGHT_NETWORK?.trim() || 'preprod',
  apiUrl: (import.meta.env.VITE_API_URL?.trim() || 'http://localhost:3001/api').replace(/\/$/, ''),
} as const;
