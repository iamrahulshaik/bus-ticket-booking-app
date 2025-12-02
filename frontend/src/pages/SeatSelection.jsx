import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/seatSelection.css";

const SeatSelection = () => {
  const { busId } = useParams();
  const navigate = useNavigate();

  const [totalSeats, setTotalSeats] = useState(30);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [fareAmount, setFareAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/schedules/${busId}/seats/`);
        const data = await res.json();

        const booked = data
          .filter((seat) => !seat.is_available)
          .map((seat) => Number(seat.seat_number.replace(/\D+/g, "")));

        setBookedSeats(booked);
        setTotalSeats(data.length || 30);
      } catch (error) {
        console.error("Error fetching seats:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFare = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/schedules/${busId}/`);
        const data = await res.json();
        setFareAmount(parseFloat(data.fare_amount));
      } catch (error) {
        console.error("Error fetching fare:", error);
      }
    };

    fetchSeats();
    fetchFare();
  }, [busId]);

  const handleSeatClick = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  // ✅ Razorpay Payment + Booking
  const handleConfirm = async () => {
    const username = localStorage.getItem("username");

    if (!username) {
      alert("⚠️ Please log in before booking!");
      navigate("/account/login");
      return;
    }

    if (selectedSeats.length === 0) {
      alert("Please select at least one seat!");
      return;
    }

    const totalPrice = fareAmount * selectedSeats.length;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/book_seats_with_payment/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schedule_id: busId,
          seat_numbers: selectedSeats,
          username: username,
          amount: totalPrice,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Something went wrong!");
        return;
      }

      if (!window.Razorpay) {
        alert("❌ Razorpay SDK failed to load. Please refresh the page.");
        return;
      }

      const options = {
        key: "rzp_test_Rc9a1tetxWiY2z",
        amount: data.amount * 100,
        currency: "INR",
        name: "Wegoo Bus Booking",
        description: `Booking ${selectedSeats.length} seats`,
        order_id: data.order_id,

        // ✅ PAYMENT SUCCESS
        handler: async function () {

          // ✅ CALL CONFIRM BOOKING API
          await fetch("http://127.0.0.1:8000/api/confirm_booking/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              order_id: data.order_id,
              username: username,
            }),
          });

          alert("✅ Payment Successful! Seats Confirmed.");

          setBookedSeats([...bookedSeats, ...selectedSeats]);
          setSelectedSeats([]);
          window.location.reload(); // ✅ ensures UI updates
        },

        prefill: {
          name: username,
          email: "user@example.com",
          contact: "9999999999",
        },

        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Booking error:", error);
      alert("❌ Something went wrong while booking seats");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading seat layout...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <Navbar />
      <div className="max-w-md mx-auto mt-20 bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          🚌 Select Your Seats
        </h2>

        <div className="legend">
          <div><span className="legend-color legend-available"></span> Available</div>
          <div><span className="legend-color legend-selected"></span> Selected</div>
          <div><span className="legend-color legend-booked"></span> Booked</div>
        </div>

        <div className="driver-seat">
          <span className="driver-icon">🪶🚍 Driver</span>
        </div>

        <div className="seat-layout">
          {[0, 1, 2].map((col) => (
            <div key={col} className="seat-column">
              {Array.from({ length: 10 }, (_, row) => {
                const seatNumber = col * 10 + row + 1;
                const isBooked = bookedSeats.includes(seatNumber);
                const isSelected = selectedSeats.includes(seatNumber);

                if (seatNumber > totalSeats) return null;

                return (
                  <div
                    key={seatNumber}
                    onClick={() => handleSeatClick(seatNumber)}
                    className={`seat-item ${
                      isBooked ? "booked"
                        : isSelected ? "selected"
                        : "available"
                    }`}
                  >
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="seat-svg"
                    >
                      <path d="M7.38,15a1,1,0,0,1,.9.55A2.61,2.61,0,0,0,10.62,17h2.94a2.61,2.61,0,0,0,2.34-1.45,1,1,0,0,1,.9-.55h1.62L19,8.68a1,1,0,0,0-.55-1L17.06,7l-.81-3.24a1,1,0,0,0-1-.76H8.72a1,1,0,0,0-1,.76L6.94,7l-1.39.69a1,1,0,0,0-.55,1L5.58,15Z"
                        strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16.8,15H19a1,1,0,0,1,1,1.16l-.53,3.17a2,2,0,0,1-2,1.67h-11a2,2,0,0,1-2-1.67L4,16.16A1,1,0,0,1,5,15H7.38a1,1,0,0,1,.9.55A2.61,2.61,0,0,0,10.62,17h2.94a2.61,2.61,0,0,0,2.34-1.45A1,1,0,0,1,16.8,15Z"
                        strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="text-center mt-4 text-gray-700 font-medium">
          Selected:{" "}
          {selectedSeats.length > 0
            ? `${selectedSeats.join(", ")} (₹${fareAmount * selectedSeats.length})`
            : "None"}
        </div>

        <div className="button-group">
          <button onClick={handleConfirm} className="confirm-btn">
            Confirm & Pay
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 text-white rounded-lg font-semibold transition"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
