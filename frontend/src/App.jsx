import { useState } from "react";
import Registration from "./pages/Registration";
import QRScanner from "./components/QRScanner";
import Dashboard from "./components/Dashboard";

function App() {
  const [activeTab, setActiveTab] = useState("registration");

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>GateKeeper - Event Check-in System</h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={() => setActiveTab("registration")}>
          Student Registration
        </button>

        <button onClick={() => setActiveTab("scanner")}>
          QR Scanner
        </button>

        <button onClick={() => setActiveTab("dashboard")}>
          Organiser Dashboard
        </button>
      </div>

      {activeTab === "registration" && <Registration />}
      {activeTab === "scanner" && <QRScanner />}
      {activeTab === "dashboard" && <Dashboard />}
    </div>
  );
}

export default App;