import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Import the CSS file for styling

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      // API call to backend using fetch
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // important for cookies
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Store JWT if provided
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        navigate("/home"); // redirect to customer dashboard
      } else {
        const errData = await response.json();
        setError(errData.error || "Invalid username or password.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Customer Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div>
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit">Sign In</button>
      </form>

      <div className="login-links">
        <a href="/register">New User? Sign up here</a>
        <a href="/forgot-password">Forgot Password?</a>
      </div>
    </div>
  );
}

export default Login;
