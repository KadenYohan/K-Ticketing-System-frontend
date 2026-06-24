import { Fragment } from 'react';
import type { Seat } from '../data/mockData';
import './SeatGrid.css';

interface SeatGridProps {
  seats: Seat[];
  selectedSeats?: string[];
  onSeatClick?: (seat: Seat) => void;
  compact?: boolean;
  showBoarded?: boolean;
}

export function SeatGrid({ seats, selectedSeats = [], onSeatClick }: SeatGridProps) {
  const ROWS = 12;
  const COLS = ['A', 'B', 'C', 'D'];

  const isTaken = (seat: Seat | undefined) =>
    seat && (seat.status === 'reserved' || seat.status === 'booked' || seat.status === 'boarded');

  const handleClick = (seat: Seat | undefined) => {
    if (!seat || isTaken(seat) || !onSeatClick) return;
    onSeatClick(seat);
  };

  const availCount = seats.filter(s => s.status === 'available').length;
  const takenCount = seats.filter(s => isTaken(s)).length;

  return (
    <div className="bv-root">
      {/* ─── Legend ─── */}
      <div className="bv-legend">
        <span className="bv-legend-item"><span className="bv-sw bv-sw-avail" />Available Seat</span>
        <span className="bv-legend-item"><span className="bv-sw bv-sw-sel" />Selected Seat</span>
        <span className="bv-legend-item"><span className="bv-sw bv-sw-taken" />Occupied Seat</span>
        <span className="bv-legend-item"><span className="bv-sw-emergency" />Emergency Window</span>
        <span className="bv-legend-stats">
          <span className="bv-stat-g">{availCount} open</span>
          <span className="bv-stat-sep">·</span>
          <span className="bv-stat-r">{takenCount} taken</span>
        </span>
      </div>

      {/* ─── Vertical Bus Map ─── */}
      <div className="bv-bus">
        {/* Front of bus — driver + door */}
        <div className="bv-front">
          <div className="bv-driver">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4"/><path d="M6 20v-1a6 6 0 0 1 12 0v1"/>
            </svg>
            <span>DRIVER</span>
          </div>
          <div className="bv-front-label">FRONT OF BUS</div>
          <div className="bv-door">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 20V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16"/><path d="M2 20h20"/><path d="M14 12v.01"/>
            </svg>
            <span>DOOR</span>
          </div>
        </div>

        {/* Column labels */}
        <div className="bv-col-header">
          <div className="bv-row-num-spacer" />
          <div className="bv-col-lbl">A</div>
          <div className="bv-col-lbl">B</div>
          <div className="bv-aisle-lbl">AISLE</div>
          <div className="bv-col-lbl">C</div>
          <div className="bv-col-lbl">D</div>
        </div>

        {/* Seat rows */}
        {Array.from({ length: ROWS }, (_, i) => {
          const rowNum = i + 1;
          const isEmergencyRow = (rowNum === 5 || rowNum === 10);
          return (
            <div key={rowNum} className="bv-seat-row">
              {isEmergencyRow && (
                <Fragment>
                  <div className="bv-emergency-window left" title="Emergency Exit">
                    <span className="bv-glass-breaker" />
                    <span className="bv-emergency-lbl">EXIT</span>
                  </div>
                  <div className="bv-emergency-window right" title="Emergency Exit">
                    <span className="bv-glass-breaker" />
                    <span className="bv-emergency-lbl">EXIT</span>
                  </div>
                </Fragment>
              )}
              <div className="bv-row-num">{rowNum}</div>
              {renderSeat(rowNum, 'A')}
              {renderSeat(rowNum, 'B')}
              <div className="bv-aisle-gap" />
              {renderSeat(rowNum, 'C')}
              {renderSeat(rowNum, 'D')}
            </div>
          );
        })}

        {/* Rear */}
        <div className="bv-rear">
          <span>REAR OF BUS</span>
        </div>
      </div>
    </div>
  );

  function renderSeat(row: number, col: string) {
    const seat = seats.find(s => s.row === row && s.col === col);
    if (!seat) return <div className="bv-seat bv-seat-empty" />;

    const taken = isTaken(seat);
    const selected = selectedSeats.includes(seat.label);

    let cls = 'bv-seat';
    if (taken) cls += ' bv-seat-taken';
    else if (selected) cls += ' bv-seat-sel';
    else cls += ' bv-seat-avail';

    return (
      <button
        key={seat.label}
        className={cls}
        disabled={taken}
        onClick={() => handleClick(seat)}
        aria-label={`Seat ${seat.label}${taken ? ' occupied' : selected ? ' selected' : ' available'}`}
      >
        <svg viewBox="0 0 40 40" className="bv-seat-svg" aria-hidden="true">
          <rect x="4" y="2" width="32" height="36" rx="6" fill="#000" opacity="0.1" />
          <rect x="5" y="28" width="30" height="10" rx="4" fill="currentColor" opacity="0.95" />
          <rect x="3" y="10" width="5" height="20" rx="2.5" fill="currentColor" opacity="0.75" />
          <rect x="32" y="10" width="5" height="20" rx="2.5" fill="currentColor" opacity="0.75" />
          <path d="M 8 26 L 32 26 C 33.1 26, 34 25.1, 34 24 L 34 6 C 34 3.8, 32.2 2, 30 2 L 10 2 C 7.8 2, 6 3.8, 6 6 L 6 24 C 6 25.1, 6.9 26, 8 26 Z" fill="currentColor" opacity="0.85" />
          <rect x="12" y="32" width="16" height="6" rx="3" fill="currentColor" opacity="0.6" />
        </svg>
        <span className="bv-seat-lbl">{seat.label}</span>
      </button>
    );
  }
}
