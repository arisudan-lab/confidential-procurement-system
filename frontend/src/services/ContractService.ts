/**
 * ContractService — high-level orchestrator that ties MidnightClient
 * (wallet connection) and ProcurementContract (circuit calls) together.
 *
 * This is the primary API surface that UI components call.  It manages:
 *   1. Wallet connection lifecycle
 *   2. Contract instance creation and caching
 *   3. Bid submission with ZK proof generation
 *   4. Public ledger state reads
 *   5. Error classification for the UI
 *
 * Every operation flows through the Lace wallet — there is no backend
 * proxy for the L2 transaction pipeline.
 */
import { midnightClient } from '../midnight/MidnightClient';
import {
  ProcurementContract,
  generateNonce,
  stringToBytes32,
  TenderStatus,
  type LedgerState,
  type CircuitTxResult,
  type BidWitnesses,
} from '../contracts/ProcurementContract';
import { MidnightConfig } from '../midnight/Config';

// ─── Configuration ──────────────────────────────────────────────────────────────

/** The deployed contract address from .midnight-state.json */
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS?.trim()
  || 'f153d0ddad13e2888233b4ac622d47c2b7b3a3f6cfafdb7c41d270376b34c632';

/** Base URL for ZK circuit assets (ZKIR + keys) */
const ZK_CONFIG_BASE_URL = import.meta.env.VITE_ZK_CONFIG_URL?.trim()
  || `${MidnightConfig.apiUrl}/zk-config`;

// ─── Error Types ────────────────────────────────────────────────────────────────

export type ContractErrorType =
  | 'WALLET_NOT_CONNECTED'
  | 'WALLET_REJECTED'
  | 'NETWORK_MISMATCH'
  | 'PROOF_FAILURE'
  | 'CONTRACT_NOT_FOUND'
  | 'CIRCUIT_ASSERTION'
  | 'TIMEOUT'
  | 'UNKNOWN';

export class ContractError extends Error {
  type: ContractErrorType;

  constructor(message: string, type: ContractErrorType) {
    super(message);
    this.name = 'ContractError';
    this.type = type;
  }
}

// ─── Service ────────────────────────────────────────────────────────────────────

export class ContractService {
  private static contract: ProcurementContract | null = null;
  private static initialized = false;

  /**
   * Ensure the MidnightClient is connected and a ProcurementContract
   * instance exists.  Idempotent — safe to call multiple times.
   */
  static async initialize(): Promise<void> {
    if (this.initialized && this.contract) return;

    if (!midnightClient.isConnected) {
      try {
        await midnightClient.connect();
      } catch (error: any) {
        if (/reject|declin|denied/i.test(error.message)) {
          throw new ContractError(
            'Wallet connection was rejected by the user.',
            'WALLET_REJECTED'
          );
        }
        throw new ContractError(
          error.message || 'Failed to connect wallet',
          'WALLET_NOT_CONNECTED'
        );
      }
    }

    const networkConfig = midnightClient.networkConfig;
    if (!networkConfig) {
      throw new ContractError('Could not determine network configuration', 'WALLET_NOT_CONNECTED');
    }

    // Verify we are on the expected network
    const expectedNetwork = MidnightConfig.networkId;
    if (networkConfig.networkId !== expectedNetwork) {
      throw new ContractError(
        `Network mismatch: wallet is on "${networkConfig.networkId}" but DApp expects "${expectedNetwork}".`,
        'NETWORK_MISMATCH'
      );
    }

    // Build the provider bundle from the connected wallet
    const providers = await midnightClient.buildProviders(ZK_CONFIG_BASE_URL);

    // Create the contract wrapper pointing at the deployed address
    this.contract = new ProcurementContract(CONTRACT_ADDRESS, providers);
    this.initialized = true;
  }

  /**
   * Submit a sealed bid to the procurement contract.
   *
   * Flow:
   *   1. Ensure wallet is connected and contract is initialized
   *   2. Encode supplier address + secret notes into Bytes<32>
   *   3. Generate a random 32-byte nonce (never leaves the browser)
   *   4. Invoke the `submitBid` circuit with full witness injection
   *   5. Return the transaction hash and updated ledger state
   *
   * All private data (supplier, amount, secret, nonce) is consumed
   * by the ZK circuit as witness values and never disclosed.
   */
  static async submitBid(params: {
    supplier: string;
    amount: number;
    secret: string;
  }): Promise<CircuitTxResult> {
    await this.initialize();

    const witnesses: BidWitnesses = {
      supplier: stringToBytes32(params.supplier),
      bidAmount: BigInt(Math.round(params.amount * 100)), // cents precision
      secret: stringToBytes32(params.secret),
      nonce: generateNonce(),
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60_000); // 60s for proof gen

    try {
      // Join the contract with witness values
      await this.contract!.join(witnesses);

      // Invoke the submitBid circuit → prove → balance → submit
      const result = await this.contract!.submitBid(witnesses);

      return result;
    } catch (error: any) {
      // Classify the error for the UI
      throw this.classifyError(error);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Read the current public ledger state from the deployed contract.
   *
   * Returns only publicly disclosed data:
   *   - tenderId
   *   - tenderStatus (OPEN / CLOSED / AWARDED)
   *   - bidCount
   *   - winningCommitment
   */
  static async readLedgerState(): Promise<LedgerState | null> {
    await this.initialize();
    return this.contract!.readLedger();
  }

  /**
   * Get the current bid count from the public ledger.
   * Convenience wrapper around readLedgerState().
   */
  static async getBidCount(): Promise<string> {
    try {
      const state = await this.readLedgerState();
      return state?.bidCount?.toString() ?? '0';
    } catch {
      return '0';
    }
  }

  /**
   * Get the tender status from the public ledger.
   */
  static async getTenderStatus(): Promise<TenderStatus> {
    const state = await this.readLedgerState();
    return state?.tenderStatus ?? TenderStatus.OPEN;
  }

  /**
   * Create a new tender (admin operation).
   */
  static async createTender(tenderId: string): Promise<CircuitTxResult> {
    await this.initialize();
    try {
      return await this.contract!.createTender(stringToBytes32(tenderId));
    } catch (error: any) {
      throw this.classifyError(error);
    }
  }

  /**
   * Close an open tender (admin operation).
   */
  static async closeTender(): Promise<CircuitTxResult> {
    await this.initialize();
    try {
      return await this.contract!.closeTender();
    } catch (error: any) {
      throw this.classifyError(error);
    }
  }

  /**
   * Award a closed tender (admin operation).
   */
  static async awardTender(winnerCommitment: string): Promise<CircuitTxResult> {
    await this.initialize();
    try {
      return await this.contract!.awardTender(stringToBytes32(winnerCommitment));
    } catch (error: any) {
      throw this.classifyError(error);
    }
  }

  /**
   * Reset the service state (e.g. on wallet disconnect).
   */
  static reset(): void {
    this.contract = null;
    this.initialized = false;
  }

  // ─── Error Classification ───────────────────────────────────────────────────

  private static classifyError(error: any): ContractError {
    const msg = error.message || String(error);

    if (/abort|timeout/i.test(msg)) {
      return new ContractError(
        'Transaction timed out. The proof generation may have taken too long.',
        'TIMEOUT'
      );
    }

    if (/reject|declin|denied|cancel/i.test(msg)) {
      return new ContractError(
        'Transaction was rejected by the wallet.',
        'WALLET_REJECTED'
      );
    }

    if (/network.*mismatch|wrong.*network/i.test(msg)) {
      return new ContractError(msg, 'NETWORK_MISMATCH');
    }

    if (/proof.*fail|proving.*error|zkir/i.test(msg)) {
      return new ContractError(
        'Zero-knowledge proof generation failed. Please try again.',
        'PROOF_FAILURE'
      );
    }

    if (/not found|no.*contract/i.test(msg)) {
      return new ContractError(
        'The procurement contract was not found at the expected address.',
        'CONTRACT_NOT_FOUND'
      );
    }

    if (/assert|Tender is not open|must be closed/i.test(msg)) {
      return new ContractError(msg, 'CIRCUIT_ASSERTION');
    }

    return new ContractError(msg, 'UNKNOWN');
  }
}
