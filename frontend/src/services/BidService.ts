export interface BidPayload {
  supplier: string;
  amount: number;
  secret: string;
}

export class BidService {
  private static API_URL = 'http://localhost:3001/api/bids';
  private static TENDER_API_URL = 'http://localhost:3001/api/tenders';

  static async getBidCount(): Promise<string> {
    try {
      const response = await fetch(`${this.TENDER_API_URL}/state`);
      const data = await response.json();
      if (response.ok && data.success) {
        return data.bidCount;
      }
      return '0';
    } catch {
      return '0';
    }
  }

  static async submitBid(payload: BidPayload): Promise<void> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for proof generation

    try {
      const response = await fetch(`${this.API_URL}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Proof failure or contract rejection');
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Timeout: The proof generation took too long to complete.');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
