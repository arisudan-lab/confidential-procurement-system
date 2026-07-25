import './NetworkStatus.css';

interface NetworkStatusProps {
  network: string;
}

export function NetworkStatus({ network }: NetworkStatusProps) {
  const getNetworkInfo = () => {
    switch (network) {
      case 'undeployed':
        return { label: 'Local Devnet', color: 'local' };
      case 'preview':
        return { label: 'Preview Testnet', color: 'preview' };
      case 'preprod':
        return { label: 'Preprod Testnet', color: 'preprod' };
      default:
        return { label: network, color: 'unknown' };
    }
  };

  const info = getNetworkInfo();

  return (
    <div className={`network-status ${info.color}`}>
      <span className="network-dot"></span>
      <span className="network-label">{info.label}</span>
    </div>
  );
}
