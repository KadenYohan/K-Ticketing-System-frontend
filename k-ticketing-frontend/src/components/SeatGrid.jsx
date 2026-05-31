/**
 * SeatGrid — High-density asymmetric bus seat layout
 *
 * Layout: [A][B] [AISLE] [C][D]
 * Grid columns: 1fr 1fr | 18px gap | 1fr 1fr
 * Each seat is a compact 34×30px rounded rectangle.
 * 48 seats = 12 rows → fits comfortably in ≤55% of viewport height.
 */

export default function SeatGrid({ seats, selectedSeats, onSeatToggle }) {

  const renderSeatLayout = () => {
    const cells = [];
    const seatsPerRow = 4;

    for (let i = 0; i < seats.length; i += seatsPerRow) {
      const row = seats.slice(i, i + seatsPerRow);

      // Left pair
      cells.push(renderSeat(row[0]));
      cells.push(renderSeat(row[1]));

      // Physical aisle column — purely decorative spacer
      cells.push(
        <div key={`aisle-${i}`} aria-hidden="true" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: '1px',
            height: '70%',
            background: '#e2e8f0',
            borderRadius: '1px',
          }} />
        </div>
      );

      // Right pair
      cells.push(renderSeat(row[2]));
      cells.push(renderSeat(row[3]));
    }

    return cells;
  };

  const renderSeat = (seat) => {
    if (!seat) {
      return <div key={`empty-${Math.random()}`} />;
    }

    const isSelected = selectedSeats.includes(seat.seatNumber);
    let extraClass = '';
    let disabled = false;

    if (seat.status === 'reserved') {
      extraClass = 'seat-btn-reserved';
      disabled = true;
    } else if (seat.status === 'booked' || seat.status === 'boarded') {
      extraClass = 'seat-btn-booked';
      disabled = true;
    } else if (isSelected) {
      extraClass = 'seat-btn-selected';
    }

    return (
      <button
        key={seat.seatId}
        disabled={disabled}
        onClick={() => onSeatToggle(seat.seatNumber)}
        className={`seat-btn ${extraClass}`}
        aria-label={`Seat ${seat.seatNumber}, ${seat.status}`}
      >
        {seat.seatNumber}
      </button>
    );
  };

  return (
    <div className="seat-map-compact">
      {/* Driver / Front-of-bus header strip */}
      <div className="seat-map-front-strip">
        <span className="seat-map-front-label">FRONT OF BUS</span>
        <div className="seat-map-driver-chip">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" style={{ transform: 'rotate(-90deg)', opacity: 0.7 }}>
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
          </svg>
          <span>Driver</span>
        </div>
      </div>

      {/* Seat Legend */}
      <div className="seat-legend">
        <span className="legend-item legend-available"><span className="legend-dot" />Available</span>
        <span className="legend-item legend-selected"><span className="legend-dot" />Selected</span>
        <span className="legend-item legend-taken"><span className="legend-dot" />Taken</span>
      </div>

      {/* High-density seat grid */}
      <div className="seat-grid-dense">
        {renderSeatLayout()}
      </div>
    </div>
  );
}
