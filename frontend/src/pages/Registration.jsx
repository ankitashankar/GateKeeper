import React, { useState } from "react";
import QRCode from "qrcode";
import "./Registration.css";

function Registration() {
  const [formData, setFormData] = useState({
    name: "",
    usn: "",
    email: "",
    phone: "",
    eventName: ""
  });

  const [qrCode, setQrCode] = useState("");
  const [registrationId, setRegistrationId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");
    setQrCode("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/registration/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      const uniqueId = data.registrationId;

      // Generate QR code using the registration ID
      const generatedQR = await QRCode.toDataURL(uniqueId);

      setQrCode(generatedQR);
      setRegistrationId(uniqueId);
      setSuccess("Registration completed successfully!");

      setFormData({
        name: "",
        usn: "",
        email: "",
        phone: "",
        eventName: ""
      });

    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `Gatekeeper-${registrationId}.png`;
    link.click();
  };

  return (
    <div className="registration-container">

      <div className="registration-card">

        <h1>Gatekeeper</h1>
        <p className="subtitle">Event Registration Portal</p>
        <div className="brand-content">
          <h2>Seamless Event Entry Starts Here.</h2>

          <p>
            Register for your event, receive your unique QR code,
            and enjoy a faster, hassle-free check-in experience.
          </p>

          <div className="brand-features">
            <p>✓ Quick Student Registration</p>
            <p>✓ Secure QR Code Generation</p>
            <p>✓ Faster Event Check-in</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-intro">
            <h2>Create your account</h2>
            <p>Enter your details to register for the event.</p>
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>USN / Student ID</label>
            <input
              type="text"
              name="usn"
              placeholder="Enter your USN"
              value={formData.usn}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              pattern="[0-9]{10}"
              title="Enter a valid 10-digit phone number"
              required
            />
          </div>

          <div className="form-group">
            <label>Event Name</label>
            <input
              type="text"
              name="eventName"
              placeholder="Enter event name"
              value={formData.eventName}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register Now"}
          </button>

        </form>

        {error && <p className="error-message">{error}</p>}

        {success && (
          <div className="success-section">
            <h3>{success}</h3>

            <p>Registration ID: {registrationId}</p>

            <img
              src={qrCode}
              alt="Registration QR Code"
              className="qr-image"
            />

            <p>Show this QR code at the event entrance.</p>

            <button onClick={downloadQR}>
              Download QR Code
            </button>
          </div>
        )}

      </div>

    </div>
  );
}

export default Registration;