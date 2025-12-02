import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = () => {
  const [showAccount, setShowAccount] = useState(false);

  const toggleAccount = () => {
    setShowAccount((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <h2 className="logo">Wegoo</h2>

      <div className="nav-links">
        {/* Home link */}
        <Link to="/" className="nav-link">
          Home
        </Link>

        {/* Login button + dropdown */}
        <div className="login-wrapper">
          <button
            className="nav-link login-btn"
            onClick={toggleAccount}
            type="button"
          >
            Login ⬇
          </button>

          {showAccount && (
            <div className="account-dropdown">
              <Link
                to="/account/login"
                className="dropdown-item"
                onClick={() => setShowAccount(false)}
              >
                Login
              </Link>
              <Link
                to="/account/signup"
                className="dropdown-item"
                onClick={() => setShowAccount(false)}
              >
                Signup
              </Link>
            </div>
          )}
        </div>

        {/* ⭕ Small Round Register Button */}
        <Link to="/admin/register" className="register-circle">
          +
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
