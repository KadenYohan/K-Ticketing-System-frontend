export default function StatusBadge({ status }) {
  if (!status) return null;
  
  const normalized = status.toLowerCase();
  
  let badgeClass;
  let label;

  switch (normalized) {
    case 'available':
      badgeClass = 'badge-available';
      label = 'Available';
      break;
    case 'reserved':
      badgeClass = 'badge-reserved';
      label = 'Reserved';
      break;
    case 'booked':
      badgeClass = 'badge-booked';
      label = 'Booked';
      break;
    case 'boarded':
      badgeClass = 'badge-boarded';
      label = 'Boarded';
      break;
    case 'pending':
      badgeClass = 'badge-pending';
      label = 'Pending Payment';
      break;
    case 'paid':
    case 'success':
    case 'valid':
      badgeClass = 'badge-success';
      label = normalized === 'paid' ? 'Paid' : normalized === 'valid' ? 'Valid' : 'Success';
      break;
    case 'failed':
    case 'invalid':
    case 'error':
      badgeClass = 'badge-danger';
      label = normalized === 'failed' ? 'Failed' : normalized === 'invalid' ? 'Invalid' : 'Error';
      break;
    default:
      badgeClass = 'badge-secondary';
      label = status;
  }

  return (
    <span className={`status-badge ${badgeClass}`}>
      <span className="badge-dot"></span>
      {label}
    </span>
  );
}
