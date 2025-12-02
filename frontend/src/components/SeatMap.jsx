// src/components/SeatMap.jsx
import React, {useState} from 'react';

export default function SeatMap({seats, onSelectSeat}) {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10}}>
      {seats.map(seat => (
        <button
          key={seat.id}
          disabled={!seat.is_available}
          onClick={() => { setSelected(seat.id); onSelectSeat(seat); }}
          style={{padding:12, border:selected===seat.id ? '2px solid blue':'1px solid #ccc'}}
        >
          {seat.seat_number}
        </button>
      ))}
    </div>
  );
}
