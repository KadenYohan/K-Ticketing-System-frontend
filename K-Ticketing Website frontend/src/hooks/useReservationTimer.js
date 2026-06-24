// useReservationTimer — counts down from a server-supplied expiresAt ISO string.
// Calls onExpire() once when the timer hits zero.
import { useState, useEffect, useRef } from 'react';

export function useReservationTimer(expiresAt, onExpire) {
  const [timeLeft, setTimeLeft] = useState('');
  const expiredRef = useRef(false);

  useEffect(() => {
    if (!expiresAt) return;
    expiredRef.current = false;

    const tick = () => {
      const ms = new Date(expiresAt).getTime() - Date.now();
      if (ms <= 0) {
        setTimeLeft('00:00');
        if (!expiredRef.current) {
          expiredRef.current = true;
          onExpire?.();
        }
        return;
      }
      const m = Math.floor(ms / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setTimeLeft(`${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return timeLeft;
}
