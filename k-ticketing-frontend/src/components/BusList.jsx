

import { BUS_SEAT_CAPACITY } from '../mock/data';

export default function BusList({ buses, onSelectBus }) {
  if (!buses || buses.length === 0) {
    return (
      <div className="no-schedules">
        <p>No active departure schedules found for the selected destination on this date.</p>
      </div>
    );
  }

  return (
    <div className="bus-list">
      {buses.map(bus => {
        const isFull = bus.seatsAvailable === 0;
        return (
          <div key={bus.id} className={`bus-card fade-in ${isFull ? 'bus-card-full' : ''}`}>
            <div className="bus-card-header">
              <div className="bus-time-wrapper">
                <span className="bus-time-label">Departure</span>
                <span className="bus-time">{bus.departureTime}</span>
              </div>
              <div className="bus-price-wrapper">
                <span className="bus-price">₱{parseFloat(bus.seatPrice).toFixed(2)}</span>
                <span className="bus-price-unit">per seat</span>
              </div>
            </div>
            
            <div className="bus-card-body">
              <div className="bus-seats-info">
                <div className="seats-indicator">
                  <span className="seats-indicator-fill" style={{ width: `${(bus.seatsAvailable / BUS_SEAT_CAPACITY) * 100}%` }}></span>
                </div>
                <div className="seats-count-label">
                  <span>Available Seats:</span>
                  <strong>{bus.seatsAvailable} / {BUS_SEAT_CAPACITY}</strong>
                </div>
              </div>
              
              <button
                disabled={isFull}
                onClick={() => onSelectBus(bus)}
                className={`btn btn-large mt-10 ${isFull ? 'btn-disabled' : 'btn-primary btn-gradient'}`}
              >
                {isFull ? 'Sold Out' : 'Select Departure'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
