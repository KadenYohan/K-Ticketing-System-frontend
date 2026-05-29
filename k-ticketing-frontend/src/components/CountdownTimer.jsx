import { useState, useEffect } from 'react';

export default function CountdownTimer({ initialSeconds = 30, onTimeout, label = "Time Remaining" }) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [prevInitial, setPrevInitial] = useState(initialSeconds);

  if (initialSeconds !== prevInitial) {
    setSeconds(initialSeconds);
    setPrevInitial(initialSeconds);
  }

  useEffect(() => {
    if (seconds <= 0) {
      if (onTimeout) onTimeout();
      return;
    }

    const interval = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, onTimeout]);

  const percentage = (seconds / initialSeconds) * 100;

  return (
    <div className="countdown-timer">
      <div className="timer-label">{label}</div>
      <div className="timer-display-wrapper">
        <span className="timer-seconds">{seconds}</span>
        <span className="timer-unit">s</span>
      </div>
      <div className="timer-bar-container">
        <div 
          className="timer-bar-fill" 
          style={{ 
            width: `${percentage}%`,
            background: percentage < 30 ? 'var(--danger)' : 'var(--accent)'
          }}
        ></div>
      </div>
    </div>
  );
}
