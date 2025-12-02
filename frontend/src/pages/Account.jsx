import React, { useState } from "react";
import "../styles/account.css";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    age: "",
    mobile: "",
    username: "",
    password: "",
    confirm: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin
      ? "http://127.0.0.1:8000/api/login/"
      : "http://127.0.0.1:8000/api/signup/";

    const payload = isLogin
      ? { username: form.username, password: form.password }
      : form;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        if (isLogin) {
          // ✅ Save username to localStorage after successful login
          localStorage.setItem("username", result.username || form.username);
          alert(`✅ Welcome back, ${result.username || form.username}!`);
        } else {
          alert("🎉 Account created successfully! Please log in.");
        }

        navigate("/"); // ✅ redirect to Home
      } else {
        alert(result.error || "⚠️ Something went wrong!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Server error, please try again!");
    }
  };

  return (
    <div className="account-container">
      <h2>{isLogin ? "Login" : "Create Account"}</h2>

      <form onSubmit={handleSubmit} className="account-form">
        {!isLogin && (
          <>
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />
            <input
              name="age"
              type="number"
              placeholder="Age"
              onChange={handleChange}
              required
            />
            <input
              name="mobile"
              placeholder="Mobile Number"
              onChange={handleChange}
              required
            />
          </>
        )}

        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        {!isLogin && (
          <input
            name="confirm"
            type="password"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
          />
        )}

        <button type="submit" className="account-btn">
          {isLogin ? "Login" : "Signup"}
        </button>
      </form>

      <p onClick={() => setIsLogin(!isLogin)} className="switch-text">
        {isLogin
          ? "Don't have an account? Signup"
          : "Already have an account? Login"}
      </p>
    </div>
  );
};

export default Account;
