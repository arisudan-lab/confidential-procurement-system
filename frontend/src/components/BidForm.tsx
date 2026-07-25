import { useState } from 'react';
import './Forms.css';

export function BidForm() {
  const [procurementId, setProcurementId] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [proposalDetails, setProposalDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{success: boolean; message: string; txId?: string} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      // In production, this would call the contract with zero-knowledge proof
      // The bid amount and proposal details would be private witnesses
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setResult({
        success: true,
        message: 'Confidential bid submitted successfully!',
        txId: '0x' + Math.random().toString(16).slice(2, 10) + '...'
      });
      
      setProcurementId('');
      setBidAmount('');
      setProposalDetails('');
    } catch (err: any) {
      setResult({
        success: false,
        message: err.message || 'Failed to submit bid'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="bid-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="procurementId">Procurement ID</label>
        <input
          type="number"
          id="procurementId"
          value={procurementId}
          onChange={(e) => setProcurementId(e.target.value)}
          placeholder="e.g., 1"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="bidAmount">Bid Amount (tNIGHT)</label>
        <input
          type="number"
          id="bidAmount"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          placeholder="Enter your bid amount"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="proposalDetails">Proposal Details</label>
        <textarea
          id="proposalDetails"
          value={proposalDetails}
          onChange={(e) => setProposalDetails(e.target.value)}
          placeholder="Describe your proposal (this remains private)"
          required
          rows={4}
        />
      </div>

      <button 
        type="submit" 
        className="btn-submit"
        disabled={submitting || !procurementId || !bidAmount || !proposalDetails}
      >
        {submitting ? 'Generating ZK Proof...' : 'Submit Confidential Bid'}
      </button>

      {result && (
        <div className={`result ${result.success ? 'success' : 'error'}`}>
          {result.message}
          {result.txId && <div className="tx-id">TX: {result.txId}</div>}
        </div>
      )}

      <div className="privacy-notice highlight">
        <p>🔐 <strong>Zero-Knowledge Privacy:</strong></p>
        <ul>
          <li>✓ Your bid amount is <strong>private</strong> (zero-knowledge)</li>
          <li>✓ Your proposal details are <strong>private</strong> (hashed)</li>
          <li>✓ Only the bid count is public (not amounts)</li>
          <li>✓ If you win, only your address is disclosed</li>
        </ul>
      </div>
    </form>
  );
}
