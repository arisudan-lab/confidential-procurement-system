import { useState, useEffect } from 'react';
import './State.css';

interface ProcurementStateProps {
  contractAddress: string;
}

interface StateData {
  organization?: string;
  description?: string;
  deadline?: string;
  status?: string;
  bidCount?: number;
  winner?: string;
}

export function ProcurementState({ contractAddress }: ProcurementStateProps) {
  const [loading, setLoading] = useState(false);
  const [stateData, setStateData] = useState<StateData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchState = async () => {
    if (!contractAddress) return;
    
    setLoading(true);
    setError(null);

    try {
      // In production, this would query the contract state via the indexer
      // For now, simulate fetching state
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulated state data
      setStateData({
        organization: 'org_' + Math.random().toString(36).slice(2, 10),
        description: 'Office supplies procurement Q1 2026',
        deadline: new Date(1735689600000).toLocaleString(),
        status: 'OPEN',
        bidCount: Math.floor(Math.random() * 5),
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch state');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contractAddress) {
      fetchState();
    }
  }, [contractAddress]);

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'OPEN': return 'status-open';
      case 'CLOSED': return 'status-closed';
      case 'AWARDED': return 'status-awarded';
      default: return '';
    }
  };

  if (!contractAddress) {
    return (
      <div className="state-container">
        <p className="no-contract">No contract address configured</p>
      </div>
    );
  }

  return (
    <div className="state-container">
      <button className="btn-refresh" onClick={fetchState} disabled={loading}>
        {loading ? 'Loading...' : '🔄 Refresh State'}
      </button>

      {error && (
        <div className="error-state">
          <p>❌ {error}</p>
        </div>
      )}

      {loading && !stateData && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Fetching contract state from blockchain...</p>
        </div>
      )}

      {stateData && (
        <div className="state-content">
          <div className="state-grid">
            <div className="state-item">
              <span className="label">Organization:</span>
              <code>{stateData.organization}</code>
            </div>
            <div className="state-item full-width">
              <span className="label">Description:</span>
              <span>{stateData.description}</span>
            </div>
            <div className="state-item">
              <span className="label">Deadline:</span>
              <span>{stateData.deadline}</span>
            </div>
            <div className="state-item">
              <span className="label">Status:</span>
              <span className={`status-badge ${getStatusColor(stateData.status || '')}`}>
                {stateData.status}
              </span>
            </div>
            <div className="state-item">
              <span className="label">Bid Count:</span>
              <span className="bid-count">{stateData.bidCount}</span>
            </div>
            {stateData.winner && (
              <div className="state-item full-width winner">
                <span className="label">🏆 Winner:</span>
                <code>{stateData.winner}</code>
              </div>
            )}
          </div>

          <div className="state-info">
            <p>
              <strong>Note:</strong> Bid amounts and proposal details remain private.
              Only the bid count is visible on-chain.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
