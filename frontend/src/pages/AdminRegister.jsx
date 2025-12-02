import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // ✅ import navigation hook
import "../styles/adminRegister.css";

const AdminRegister = () => {
  const navigate = useNavigate(); // ✅ create navigate instance

  const [formData, setFormData] = useState({
    bus_name: "",
    travels_name: "",
    category: "",
    origin: "",
    destination: "",
    departure_time: "",
    arrival_time: "",
    fare_amount: "",
    total_seats: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const departureDateTime = new Date(formData.departure_time);
      const arrivalDateTime = new Date(formData.arrival_time);

      const data = {
        bus_name: formData.bus_name,
        travels_name: formData.travels_name,
        category: formData.category,
        origin: formData.origin,
        destination: formData.destination,
        total_seats: parseInt(formData.total_seats),  // ✅ ensure number
        departure_time: departureDateTime.toTimeString().split(" ")[0].slice(0, 5),
        arrival_time: arrivalDateTime.toTimeString().split(" ")[0].slice(0, 5),
        fare_amount: parseFloat(formData.fare_amount), // ✅ ensure number
        travel_date: departureDateTime.toISOString().split("T")[0],
      };

      const response = await axios.post("http://127.0.0.1:8000/api/register-bus/", data);

      if (response.status === 201 || response.status === 200) {
        alert("✅ Bus registered successfully!");
        setFormData({
          bus_name: "",
          travels_name: "",
          category: "",
          origin: "",
          destination: "",
          departure_time: "",
          arrival_time: "",
          fare_amount: "",
          total_seats: "",
        });
      } else {
        alert("❌ Error registering bus!");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("❌ Error registering bus! Check console for details.");
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">🚌 Register New Bus</h2>

      <form onSubmit={handleSubmit} className="register-form">
        <input name="bus_name" placeholder="Bus Name" onChange={handleChange} value={formData.bus_name} />
        <input name="travels_name" placeholder="Travels Name" onChange={handleChange} value={formData.travels_name} />

        <select name="category" onChange={handleChange} value={formData.category}>
          <option value="">Select Category</option>
          <option value="AC Seater">AC Seater</option>
          <option value="Non-AC Seater">Non-AC Seater</option>
          <option value="AC Sleeper">AC Sleeper</option>
          <option value="Non-AC Sleeper">Non-AC Sleeper</option>
        </select>

        <input name="origin" placeholder="From" onChange={handleChange} value={formData.origin} />
        <input name="destination" placeholder="To" onChange={handleChange} value={formData.destination} />

        <label>Departure Time:</label>
        <input type="datetime-local" name="departure_time" onChange={handleChange} value={formData.departure_time} />

        <label>Arrival Time:</label>
        <input type="datetime-local" name="arrival_time" onChange={handleChange} value={formData.arrival_time} />

        <input
          name="fare_amount"
          placeholder="Fare (₹)"
          type="number"
          onChange={handleChange}
          value={formData.fare_amount}
        />
        <input
          name="total_seats"
          placeholder="Total Seats"
          type="number"
          onChange={handleChange}
          value={formData.total_seats}
        />

        <button type="submit" className="register-btn">
          Register Bus
        </button>

        {/* ✅ New Back Button */}
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate("/")}
          style={{
            marginTop: "10px",
            backgroundColor: "#555",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ← Go Back to Home
        </button>
      </form>
    </div>
  );
};

export default AdminRegister;
