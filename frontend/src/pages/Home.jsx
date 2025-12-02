import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Form1 from "../components/Form1";
import "../styles/home.css";

const Home = () => {
  const [cities, setCities] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/cities/")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setCities(data))
      .catch((err) => {
        console.error("Error fetching cities:", err);
        setError("Unable to fetch cities from server.");
      });
  }, []);

  return (
    <div>
      <Navbar />
      {error ? (
        <p style={{ color: "red", marginTop: "100px" }}>{error}</p>
      ) : (
        <Form1 cities={cities} />
      )}
    </div>
  );
};

export default Home;
