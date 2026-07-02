import React, { useState } from "react";

function Login({ onViewChange, onLoginSuccess, onShowToast }) {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    let clientErrors = {};
    if (!formData.usernameOrEmail.trim()) {
      clientErrors.usernameOrEmail = "Username or email is required.";
    }
    if (!formData.password) {
      clientErrors.password = "Password is required.";
    }

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      onShowToast("Please enter all required fields.", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usernameOrEmail: formData.usernameOrEmail.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onShowToast("Login successful!", "success");
        setTimeout(() => {
          onLoginSuccess(data); // data contains token, userId, username, email, role
        }, 1000);
      } else {
        // Show validation error or invalid credentials error message
        if (data.errors) {
          setErrors(data.errors);
          onShowToast(data.message || "Login validation failed.", "error");
        } else if (data.message) {
          onShowToast(data.message, "error");
        } else {
          onShowToast("Invalid credentials. Please try again.", "error");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      onShowToast("Cannot connect to server. Is the backend running?", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div className="glass-panel" style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <span style={styles.logoText}>SalesSavvy</span>
            <div style={styles.logoDot} />
          </div>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Log in to access your sales portal</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username or Email</label>
            <input
              type="text"
              name="usernameOrEmail"
              placeholder="Enter your username or email"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              style={{
                ...styles.input,
                borderColor: errors.usernameOrEmail ? "var(--accent-error)" : "var(--border-color)",
              }}
              disabled={loading}
            />
            {errors.usernameOrEmail && <span style={styles.errorText}>{errors.usernameOrEmail}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              style={{
                ...styles.input,
                borderColor: errors.password ? "var(--accent-error)" : "var(--border-color)",
              }}
              disabled={loading}
            />
            {errors.password && <span style={styles.errorText}>{errors.password}</span>}
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? (
              <span style={styles.spinner}>Logging in...</span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            New to SalesSavvy?{" "}
            <button
              onClick={() => onViewChange("register")}
              style={styles.switchButton}
              disabled={loading}
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "20px",
    animation: "fadeIn 0.5s ease-out",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    padding: "40px 30px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  header: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    marginBottom: "4px",
  },
  logoText: {
    fontFamily: "var(--font-title)",
    fontSize: "24px",
    fontWeight: "800",
    letterSpacing: "-0.5px",
    background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  logoDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "var(--accent-secondary)",
    marginTop: "8px",
  },
  title: {
    fontFamily: "var(--font-title)",
    fontSize: "24px",
    fontWeight: "700",
    color: "var(--text-primary)",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "14px",
    color: "var(--text-secondary)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "12px",
    fontWeight: "600",
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "14px",
    color: "var(--text-primary)",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid var(--border-color)",
    borderRadius: "10px",
    outline: "none",
    transition: "var(--transition-fast)",
  },
  errorText: {
    fontSize: "12px",
    color: "var(--accent-error)",
    marginTop: "2px",
  },
  button: {
    width: "100%",
    padding: "14px",
    fontSize: "15px",
    fontWeight: "600",
    color: "#fff",
    background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
    transition: "var(--transition-normal)",
    marginTop: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  footer: {
    textAlign: "center",
  },
  footerText: {
    fontSize: "14px",
    color: "var(--text-secondary)",
  },
  switchButton: {
    background: "none",
    border: "none",
    color: "var(--accent-primary)",
    fontWeight: "600",
    cursor: "pointer",
    padding: "0",
    fontFamily: "inherit",
    fontSize: "inherit",
    marginLeft: "4px",
    textDecoration: "underline",
  },
};

export default Login;
