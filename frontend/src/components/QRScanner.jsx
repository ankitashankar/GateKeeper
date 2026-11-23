
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

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
    console.log("QR CONTENT DETECTED:", decodedText);
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
    } catch (error) {
      try {
        await scanner.start(
          { facingMode: "user" },
          config,
          verifyQR,
          () => {}
        );
      } catch (cameraError) {
        setResult({
          success: false,
          message: "Could not start camera. Check camera permissions.",
        });
      }
    }
setCameraActive(true);
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
        message: "Could not read QR code from this image. Try a clearer image.",
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
    <div>
      <h2>Gatekeeper QR Scanner</h2>
      <p>Scan using camera or upload a QR image.</p>

      <div id="qr-reader" style={{ width: "100%", maxWidth: "500px" }} />

      <div style={{ margin: "15px 0" }}>
        {!cameraActive ? (
          <button onClick={startCamera}>
            Start Camera
          </button>
        ) : (
          <button onClick={stopCamera}>
            Stop Camera
          </button>
        )}
      </div>

      <hr />

      <h3>Upload QR Code Image</h3>

      <input
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={handleImageUpload}
      />

      {loading && <p>Verifying participant...</p>}

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3 style={{
            color: result.success ? "green" : "red"
          }}>
            {result.success ? "Check-in Successful!" : "Check-in Failed"}
          </h3>

          <p>{result.message}</p>

          {result.participant && (
            <p>Participant: {result.participant}</p>
          )}

          <button onClick={scanNext}>
            Scan Next Participant
          </button>
        </div>
      )}
    </div>
  );
}

export default QRScanner;
