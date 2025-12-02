import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/buscard.css";

const BusCard = ({ bus }) => {
  const navigate = useNavigate();

  const handleViewSeats = () => {
    navigate(`/seat-selection/${bus.id}`); // Navigate to seat selection page
  };

  return (
    <div className="bus-card">
      <div className="bus-header">
        <h2 className="bus-title">{bus.travels_name}</h2>
        <span className="bus-category">{bus.category}</span>
      </div>

      <h3 className="bus-name">{bus.bus_name}</h3>

      <div className="bus-route">
        <p>
          <strong>From:</strong> {bus.origin}
        </p>
        <p>
          <strong>To:</strong> {bus.destination}
        </p>
      </div>

      <div className="bus-timing">
        <p>
          🕓 <strong>Departure:</strong> {bus.departure_time}
        </p>
        <p>
          ⏰ <strong>Arrival:</strong> {bus.arrival_time}
        </p>
      </div>

      <div className="bus-fare">
        <p>
          💰 <strong>Fare:</strong> ₹{bus.fare_amount}
        </p>
        <p>
          📅 <strong>Date:</strong> {bus.travel_date}
        </p>
      </div>

      <div className="bus-actions">
        <button className="view-seats-btn" onClick={handleViewSeats}>
          View Seats
        </button>
      </div>
    </div>
  );
};

export default BusCard;
