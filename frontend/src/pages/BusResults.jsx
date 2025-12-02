// src/pages/BusResults.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import BusCard from "../components/BusCard";
import Navbar from "../components/Navbar";

const BusResults = () => {
  const location = useLocation();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const queryParams = new URLSearchParams(location.search);
  const from = queryParams.get("from");
  const to = queryParams.get("to");
  const date = queryParams.get("date");

  useEffect(() => {
    if (from && to && date) {
      setLoading(true);
      setError("");
      axios
        .get(`http://127.0.0.1:8000/api/search_buses/?from=${from}&to=${to}&date=${date}`)
        .then((res) => {
          console.log("✅ Buses Data:", res.data);
          if (Array.isArray(res.data)) {
            setBuses(res.data);
          } else {
            setError("Unexpected response format");
          }
        })
        .catch((err) => {
          console.error("❌ Error fetching buses:", err);
          if (err.response) {
            setError(`Server Error (${err.response.status}): ${err.response.data.error || "Something went wrong"}`);
          } else {
            setError("Network error: Failed to connect to backend");
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setError("Please provide from, to, and date.");
    }
  }, [from, to, date]);

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading buses...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-50 min-h-screen">
        {buses.length === 0 ? (
          <p className="text-center text-gray-600">
            No buses found for this route and date.
          </p>
        ) : (
          buses.map((bus, index) => <BusCard key={index} bus={bus} />)
        )}
      </div>
    </>
  );
};

export default BusResults;
