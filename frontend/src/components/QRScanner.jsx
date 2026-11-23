
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "../pages/QRScanner.css";

function QRScanner() {
  const scannerRef = useRef(null);
  const hasScanned = useRef(false);

  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    return () => {
      if (scanner.isScanning) {
        scanner.stop()
          .then(() => scanner.clear())
          .catch((error) => {
            console.error("Scanner cleanup error:", error);
          });
      } else {
        try {
          scanner.clear();
        } catch (error) {
          console.error("Scanner cleanup error:", error);
        }
      }
    };
  }, []);

  const verifyQR = async (decodedText) => {
    if (hasScanned.current) return;

    hasScanned.current = true;
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            qrCode: decodedText.trim(),
          }),
        }
      );

      const data = await response.json();

      setResult({
        success: response.ok,
        message: data.message,
        participant: data.participant || null,
      });
    } catch (error) {
      setResult({
        success: false,
        message: "Cannot connect to backend.",
      });
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    const scanner = scannerRef.current;

    if (!scanner || scanner.isScanning) return;

    hasScanned.current = false;
    setResult(null);

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1,
    };

    try {
      await scanner.start(
        { facingMode: "environment" },
        config,
        verifyQR,
        () => {}
      );

      setCameraActive(true);
    } catch (error) {
      try {
        await scanner.start(
          { facingMode: "user" },
          config,
          verifyQR,
          () => {}
        );

        setCameraActive(true);
      } catch (cameraError) {
        setCameraActive(false);
        setResult({
          success: false,
          message: "Could not start camera. Check camera permissions.",
        });
      }
    }
  };

  const stopCamera = async () => {
    const scanner = scannerRef.current;

    try {
      if (scanner && scanner.isScanning) {
        await scanner.stop();
      }

      setCameraActive(false);
    } catch (error) {
      console.error("Error stopping camera:", error);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setResult({
        success: false,
        message: "Please select a valid image file.",
      });
      return;
    }

    const scanner = scannerRef.current;

    try {
      if (scanner.isScanning) {
        await scanner.stop();
        setCameraActive(false);
      }

      hasScanned.current = false;
      setResult(null);
      setLoading(true);

      const decodedText = await scanner.scanFile(file, true);

      await verifyQR(decodedText);
    } catch (error) {
      hasScanned.current = true;
      setResult({
        success: false,
        message:
          "Could not read QR code from this image. Try a clearer image.",
      });
      setLoading(false);
    }

    event.target.value = "";
  };

  const scanNext = () => {
    hasScanned.current = false;
    setResult(null);
  };

  return (
    <div className="scanner-page">
      <div className="scanner-container">

        <div className="scanner-header">
          <h1>Gatekeeper</h1>
          <p>Event Check-in Portal</p>
        </div>

        <div className="scanner-card">

          <div className="scanner-card-heading">
            <h2>QR Code Scanner</h2>
            <p>
              Scan a participant's QR code to verify their registration
              and complete event check-in.
            </p>
          </div>

          <div className="scanner-camera-section">
            <div id="qr-reader" className="qr-reader" />

            <div className="camera-controls">
              {!cameraActive ? (
                <button
                  className="scanner-button"
                  onClick={startCamera}
                  disabled={loading}
                >
                  Start Camera
                </button>
              ) : (
                <button
                  className="scanner-button stop-button"
                  onClick={stopCamera}
                >
                  Stop Camera
                </button>
              )}
            </div>
          </div>

          <div className="scanner-divider">
            <span>OR</span>
          </div>

          <div className="upload-section">
            <h3>Upload QR Code Image</h3>
            <p>Select a QR code image from your device.</p>

            <label className="upload-label">
              Choose Image
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleImageUpload}
                disabled={loading}
              />
            </label>
          </div>

          {loading && (
            <div className="loading-message">
              <div className="loader" />
              <p>Verifying participant...</p>
            </div>
          )}

          {result && (
            <div
              className={`scanner-result ${
                result.success ? "success-result" : "error-result"
              }`}
            >
              <h3>
                {result.success
                  ? "Check-in Successful!"
                  : "Check-in Failed"}
              </h3>

              <p>{result.message}</p>

              {result.participant && (
                <p className="participant-name">
                  Participant: {result.participant}
                </p>
              )}

              <button
                className="scanner-button next-button"
                onClick={scanNext}
              >
                Scan Next Participant
              </button>
            </div>
          )}

        </div>

        <p className="scanner-footer">
          Gatekeeper | Seamless Event Entry Starts Here
        </p>

      </div>
    </div>
  );
}

export default QRScanner;
