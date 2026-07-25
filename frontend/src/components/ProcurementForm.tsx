import { useState } from 'react';
import './Forms.css';

export function ProcurementForm() {
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{success: boolean; message: string; txId?: string} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      // In production, this would call the contract
      // For now, simulate a transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setResult({
        success: true,
        message: 'Procurement request created successfully!',
        txId: '0x' + Math.random().toString(16).slice(2, 10) + '...'
      });
      
      setDescription('');
      setDeadline('');
    } catch (err: any) {
      setResult({
        success: false,
        message: err.message || 'Failed to create procurement'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="procurement-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="description">Procurement Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What goods or services are you procuring?"
          required
          rows={4}
        />
      </div>

      <div className="form-group">
        <label htmlFor="deadline">Bidding Deadline (Unix Timestamp)</label>
        <input
          type="text"
          id="deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          placeholder="e.g., 1735689600"
          required
        />
        <small className="help-text">
          Tip: Use a Unix timestamp converter to find your deadline
        </small>
      </div>

      <button 
        type="submit" 
        className="btn-submit"
        disabled={submitting || !description || !deadline}
      >
        {submitting ? 'Creating...' : 'Create Procurement Request'}
      </button>

      {result && (
        <div className={`result ${result.success ? 'success' : 'error'}`}>
          {result.message}
          {result.txId && <div className="tx-id">TX: {result.txId}</div>}
        </div>
      )}

      <div className="privacy-notice">
        <p>🔒 <strong>Privacy Notice:</strong></p>
        <ul>
          <li>Your organization address is public</li>
          <li>Procurement description is public</li>
          <li>Deadline is public</li>
        </ul>
      </div>
    </form>
  );
}
