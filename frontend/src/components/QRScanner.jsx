
import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

function QRScanner() {

  const [scannedResult, setScannedResult] = useState("");
  const hasScanned = useRef(false);

  useEffect(() => {

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
      },
      false
    );

 const onScanSuccess = (decodedText) => {
  if (hasScanned.current) return;

  hasScanned.current = true;
  console.log("QR Code Scanned:", decodedText);
  setScannedResult(decodedText);
};

    const onScanError = () => {
      // Ignore temporary scanning errors
    };

    scanner.render(onScanSuccess, onScanError);

    return () => {
      scanner.clear().catch((error) => {
        console.error("Scanner cleanup error:", error);
      });
    };

  }, []);

  return (
    <div>
      <h2>Gatekeeper QR Scanner</h2>

      <p>Scan the participant's QR code below.</p>

      <div id="qr-reader"></div>

    {scannedResult && (
  <div>
    <h3>QR Code Scanned Successfully!</h3>
    <p>Scanned Data: {scannedResult}</p>

    <button
      onClick={() => {
        hasScanned.current = false;
        setScannedResult("");
      }}
    >
      Scan Next Participant
    </button>
  </div>
)}

    </div>
  );
}

export default QRScanner;
