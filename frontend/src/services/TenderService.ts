/**
 * TenderService — manages tender lifecycle operations.
 *
 * Exposes create / close / award tender operations, plus ledger state
 * reads for the tender board UI.  All circuit calls flow through the
 * ContractService → ProcurementContract → Lace wallet pipeline.
 */
import { ContractService } from './ContractService';
import {
  TenderStatus,
  type CircuitTxResult,
} from '../contracts/ProcurementContract';

export { TenderStatus };

export interface TenderSummary {
  tenderId: string;
  status: TenderStatus;
  statusLabel: string;
  bidCount: number;
  winningCommitment: string | null;
}

export class TenderService {
  /**
   * Read the current tender state from the on-chain public ledger.
   */
  static async getTenderState(): Promise<TenderSummary | null> {
    const state = await ContractService.readLedgerState();
    if (!state) return null;

    return {
      tenderId: state.tenderId,
      status: state.tenderStatus,
      statusLabel: Object.entries(TenderStatus).find(([, v]) => v === state.tenderStatus)?.[0] ?? 'UNKNOWN',
      bidCount: Number(state.bidCount),
      winningCommitment: state.winningCommitment || null,
    };
  }

  /**
   * Create a new tender on the contract.
   * Requires the wallet to be connected and the caller to be the contract deployer.
   */
  static async createTender(tenderId: string): Promise<CircuitTxResult> {
    return ContractService.createTender(tenderId);
  }

  /**
   * Close an open tender, preventing further bids.
   */
  static async closeTender(): Promise<CircuitTxResult> {
    return ContractService.closeTender();
  }

  /**
   * Award a closed tender to a winning bidder.
   */
  static async awardTender(winnerCommitment: string): Promise<CircuitTxResult> {
    return ContractService.awardTender(winnerCommitment);
  }

  /**
   * Get just the bid count from the public ledger.
   */
  static async getBidCount(): Promise<number> {
    const count = await ContractService.getBidCount();
    return parseInt(count, 10) || 0;
  }
}
