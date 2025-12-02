import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/form.css";

function Form1() {
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [filteredFromCities, setFilteredFromCities] = useState([]);
  const [filteredToCities, setFilteredToCities] = useState([]);
  const [error, setError] = useState("");
  const [username, setUsername] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUsername(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    setUsername(null);
    alert("You have been logged out!");
  };

  const fetchCities = async (query, type) => {
    if (!query) {
      if (type === "from") setFilteredFromCities([]);
      else setFilteredToCities([]);
      return;
    }
    try {
      const res = await api.get(`cities/?q=${query}`);
      if (type === "from") setFilteredFromCities(res.data);
      else setFilteredToCities(res.data);
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
  };

  const handleSearch = () => {
    const date = document.getElementById("date").value;
    if (!fromInput || !toInput || !date) {
      setError("Please select both cities and a date.");
    } else if (fromInput === toInput) {
      setError("From and To cities cannot be the same!");
    } else {
      setError("");
      navigate(`/results?from=${fromInput}&to=${toInput}&date=${date}`);
    }
  };

  return (
    <div className="form_container">
      {username && (
        <div className="user-info">
          <span>
            Welcome, <strong>{username}</strong> 👋
          </span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      <div className="form1">
        <div className="input_row">
          <div className="from" style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="From where?"
              className="input_field"
              value={fromInput}
              onChange={(e) => {
                const value = e.target.value;
                setFromInput(value);
                fetchCities(value, "from");
              }}
            />
            {filteredFromCities.length > 0 && (
              <ul className="dropdown" onMouseDown={(e) => e.preventDefault()}>
                {filteredFromCities.map((city, i) => (
                  <li
                    key={i}
                    onClick={() => {
                      setFromInput(city);
                      setFilteredFromCities([]);
                    }}
                  >
                    {city}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="where" style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="To where?"
              className="input_field"
              value={toInput}
              onChange={(e) => {
                const value = e.target.value;
                setToInput(value);
                fetchCities(value, "to");
              }}
            />
            {filteredToCities.length > 0 && (
              <ul className="dropdown" onMouseDown={(e) => e.preventDefault()}>
                {filteredToCities.map((city, i) => (
                  <li
                    key={i}
                    onClick={() => {
                      setToInput(city);
                      setFilteredToCities([]);
                    }}
                  >
                    {city}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="date">
            <input type="date" id="date" className="input_field" />
          </div>
        </div>

        {error && <p className="error_message">{error}</p>}

        <button className="search_btn" onClick={handleSearch}>
          Search Buses
        </button>
      </div>
    </div>
  );
}

export default Form1;
