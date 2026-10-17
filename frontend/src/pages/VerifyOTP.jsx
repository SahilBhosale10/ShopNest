import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  // If user directly opens /verify-otp without registering
  if (!email) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <h2>Email not found</h2>

          <p>Please register again.</p>

          <button
            className="btn"
            onClick={() => navigate("/register")}
          >
            Go to Register
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      alert("Please enter a 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          otp: otp,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Email verified successfully!");

        navigate("/login");
      } else {
        alert(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("OTP Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Verify Email</h2>

        <p>
          OTP has been sent to:
        </p>

        <strong>{email}</strong>

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          maxLength={6}
          required
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setOtp(value);
          }}
        />

        <button
          type="submit"
          className="btn"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <p>
          Didn't receive OTP?
        </p>

        <button
          type="button"
          className="btn"
          onClick={() => navigate("/register")}
        >
          Register Again
        </button>
      </form>
    </div>
  );
};

export default VerifyOTP;