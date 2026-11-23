
import { useState } from "react";
import QRScanner from "./components/QRScanner";
import Dashboard from "./components/Dashboard";

function App() {
  const [activeTab, setActiveTab] = useState("scanner");

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>GateKeeper - Event Check-in System</h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={() => setActiveTab("scanner")}>
          QR Scanner
        </button>

        <button onClick={() => setActiveTab("dashboard")}>
          Organiser Dashboard
        </button>
      </div>

      {activeTab === "scanner" && <QRScanner />}
      {activeTab === "dashboard" && <Dashboard />}
    </div>
  );
}

export default App;
