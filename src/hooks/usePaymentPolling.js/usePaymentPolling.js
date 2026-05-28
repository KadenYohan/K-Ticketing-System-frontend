import { useEffect, useRef } from 'react';
import { API } from '../api';

export function usePaymentPolling(paymentId, status, onStatusChange) {
  const savedCallback = useRef(onStatusChange);

  useEffect(() => {
    savedCallback.current = onStatusChange;
  }, [onStatusChange]);

  useEffect(() => {
    if (!paymentId || status !== 'pending') return;

    const poll = async () => {
      try {
        const data = await API.pollPaymentStatus(paymentId);
        if (data.status !== 'pending') {
          savedCallback.current(data.status);
        }
      } catch (err) {
        console.error("Polling failure:", err);
      }
    };

    const interval = setInterval(poll, 2000); // 2-second polling strategy
    return () => clearInterval(interval);
  }, [paymentId, status]);
}