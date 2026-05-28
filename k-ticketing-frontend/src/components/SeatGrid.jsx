import React from 'react';

export default function SeatGrid({ seats, selectedSeats, onSeatToggle }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', maxWidth: '400px', margin: '20px auto' }}>
      {seats.map(seat => {
        const isSelected = selectedSeats.includes(seat.seatNumber);
        let bgColor = '#4caf50'; // available (green)
        let disabled = false;

        if (seat.status === 'reserved') {
          bgColor = '#9e9e9e'; // reserved (grey)
          disabled = true;
        } else if (seat.status === 'booked' || seat.status === 'boarded') {
          bgColor = '#f44336'; // taken (red)
          disabled = true;
        } else if (isSelected) {
          bgColor = '#2196f3'; // active choice (blue)
        }

        return (
          <button
            key={seat.seatId}
            disabled={disabled}
            onClick={() => onSeatToggle(seat.seatNumber)}
            style={{
              backgroundColor: bgColor,
              color: 'white',
              padding: '16px 0',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: disabled ? 'not-allowed' : 'pointer',
              boxShadow: isSelected ? '0 0 0 3px #0d47a1' : 'none'
            }}
          >
            {seat.seatNumber}
          </button>
        );
      })}
    </div>
  );
}
