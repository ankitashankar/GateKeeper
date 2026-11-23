
import { useState } from "react";
import Registration from "./pages/Registration";
import QRScanner from "./components/QRScanner";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("registration");

  return (
    <div className="app-shell">

      <header className="app-header">
        <div className="app-brand">
          <h1>Gatekeeper</h1>
          <p>Seamless Event Entry Starts Here</p>
        </div>

        <nav className="app-navigation">
          <button
            className={activeTab === "registration" ? "active" : ""}
            onClick={() => setActiveTab("registration")}
          >
            Registration
          </button>

          <button
            className={activeTab === "scanner" ? "active" : ""}
            onClick={() => setActiveTab("scanner")}
          >
            QR Scanner
          </button>

          <button
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            Organiser Dashboard
          </button>
        </nav>
      </header>

      <main className="app-content">
        {activeTab === "registration" && <Registration />}
        {activeTab === "scanner" && <QRScanner />}
        {activeTab === "dashboard" && <Dashboard />}
      </main>

    </div>
  );
}

export default App;
