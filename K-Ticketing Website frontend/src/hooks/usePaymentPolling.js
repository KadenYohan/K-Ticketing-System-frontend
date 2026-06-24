// usePaymentPolling — polls GET /payments/:id/status every 2 seconds.
// Calls onStatusChange(newStatus) whenever the status changes.
import { useEffect, useRef } from 'react';
import { API } from '../api/index';

export function usePaymentPolling(paymentId, currentStatus, onStatusChange) {
  const statusRef = useRef(currentStatus);
  statusRef.current = currentStatus;

  useEffect(() => {
    if (!paymentId || currentStatus !== 'pending') return;

    const interval = setInterval(async () => {
      try {
        const { status } = await API.pollPaymentStatus(paymentId);
        if (status !== statusRef.current) {
          onStatusChange(status);
        }
      } catch {
        // silently ignore transient errors
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [paymentId, currentStatus]);
}
