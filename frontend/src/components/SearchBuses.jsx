// src/components/SearchBuses.jsx
import React, {useState} from 'react';
import API from '../api';

export default function SearchBuses({onSelect}) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [schedules, setSchedules] = useState([]);

  const doSearch = async () => {
    // Simple filtering — more complex back-end filtering recommended
    const res = await API.get('schedules/');
    const data = res.data.filter(s => s.route.toLowerCase().includes(origin.toLowerCase()) || s.route.toLowerCase().includes(destination.toLowerCase()));
    setSchedules(data);
  }

  return (
    <div>
      <input placeholder="origin" value={origin} onChange={e=>setOrigin(e.target.value)} />
      <input placeholder="destination" value={destination} onChange={e=>setDestination(e.target.value)} />
      <button onClick={doSearch}>Search</button>

      <div>
        {schedules.map(s => (
          <div key={s.id}>
            <h4>{s.bus} — {s.route}</h4>
            <div>Departure: {s.departure_time}</div>
            <button onClick={()=>onSelect(s)}>Select</button>
          </div>
        ))}
      </div>
    </div>
  );
}
