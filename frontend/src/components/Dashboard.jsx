import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";

function Dashboard() {
  const [stats, setStats] = useState({ total: 0, checkedIn: 0, pending: 0 });
  const [participants, setParticipants] = useState([]);
  const [nextQr, setNextQr] = useState("");
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAttendance = async () => {
    try {
      const [statsResponse, participantsResponse] = await Promise.all([
        fetch("http://localhost:5000/api/attendance/stats"),
        fetch("http://localhost:5000/api/participants"),
      ]);

      if (!statsResponse.ok || !participantsResponse.ok) {
        throw new Error("Could not load attendance data");
      }

      const [statsData, participantsData] = await Promise.all([
        statsResponse.json(),
        participantsResponse.json(),
      ]);

      setStats(statsData);
      setParticipants(participantsData);
      setLastUpdated(new Date());
      setError("");
    } catch (err) {
      setError("Unable to connect to the backend. Check that the server is running.");
    }
  };

  // The API returns participants in registration order. Keep a defensive sort
  // here so the first pending registration is always shown as next in line.
  const pendingParticipants = useMemo(
    () => participants
      .filter((person) => !person.checkedIn)
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return aTime - bTime;
      }),
    [participants]
  );

  const nextParticipant = pendingParticipants[0] || null;

  useEffect(() => {
    fetchAttendance();
    const interval = setInterval(fetchAttendance, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!nextParticipant?.qrCode) {
      setNextQr("");
      return () => { cancelled = true; };
    }

    QRCode.toDataURL(nextParticipant.qrCode, {
      width: 220,
      margin: 2,
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        if (!cancelled) setNextQr(url);
      })
      .catch(() => {
        if (!cancelled) setNextQr("");
      });

    return () => { cancelled = true; };
  }, [nextParticipant?.qrCode]);

  return (
    <main style={{ padding: "20px", maxWidth: "1100px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2>Organiser Attendance Dashboard</h2>
          <p style={{ color: "#64748b", marginTop: "-8px" }}>Live registration and check-in overview</p>
        </div>
        <button onClick={fetchAttendance}>Refresh Attendance</button>
      </div>

      {error && <p role="alert" style={{ color: "#b91c1c" }}>{error}</p>}

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px", margin: "22px 0" }}>
        {[
          { label: "Total Participants", value: stats.total, color: "#0f172a" },
          { label: "Checked In", value: stats.checkedIn, color: "#15803d" },
          { label: "Awaiting Check-in", value: stats.pending, color: "#b45309" },
        ].map((item) => (
          <div key={item.label} style={{ padding: "18px", border: "1px solid #e2e8f0", borderRadius: "12px", background: "#fff" }}>
            <p style={{ margin: 0, color: "#64748b" }}>{item.label}</p>
            <h2 style={{ margin: "8px 0 0", color: item.color, fontSize: "28px" }}>{item.value}</h2>
          </div>
        ))}
      </section>

      <section style={{ margin: "24px 0", padding: "20px", border: "1px solid #cbd5e1", borderRadius: "14px", background: "#f8fafc" }}>
        <h3 style={{ marginTop: 0 }}>Next student in the first-come queue</h3>
        {nextParticipant ? (
          <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 220px" }}>
              <p style={{ margin: "4px 0" }}><strong>{nextParticipant.name}</strong></p>
              <p style={{ margin: "4px 0" }}>USN: {nextParticipant.usn || "Not provided"}</p>
              <p style={{ margin: "4px 0" }}>Email: {nextParticipant.email}</p>
              <p style={{ margin: "10px 0 0", color: "#b45309" }}>Status: Pending — registered, but the QR code has not yet been scanned successfully.</p>
              {nextParticipant.createdAt && (
                <p style={{ color: "#64748b", fontSize: "13px" }}>Registered: {new Date(nextParticipant.createdAt).toLocaleString()}</p>
              )}
            </div>
            <div style={{ background: "#fff", padding: "12px", borderRadius: "12px", textAlign: "center", border: "1px solid #e2e8f0" }}>
              {nextQr ? <img src={nextQr} alt={`QR code for ${nextParticipant.name}`} width="180" height="180" /> : <p>QR code unavailable</p>}
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>Next student's registration QR</p>
            </div>
          </div>
        ) : (
          <p style={{ color: "#15803d" }}>Everyone has checked in. No student is waiting.</p>
        )}
      </section>

      <h3>Participant Attendance</h3>
      <p style={{ color: "#64748b", fontSize: "13px" }}>
        Pending means the student is registered but has not completed QR check-in. It is not a registration failure.
      </p>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "680px" }}>
          <thead>
            <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
              {["Name", "USN", "Email", "Status / reason", "Check-in Time"].map((heading) => (
                <th key={heading} style={{ padding: "12px", borderBottom: "1px solid #cbd5e1" }}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {participants.map((person) => (
              <tr key={person._id}>
                <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>{person.name}</td>
                <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>{person.usn || "—"}</td>
                <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>{person.email}</td>
                <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0", color: person.checkedIn ? "#15803d" : "#b45309" }}>
                  {person.checkedIn ? "Checked In" : "Pending — awaiting QR scan"}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>
                  {person.checkInTime ? new Date(person.checkInTime).toLocaleString() : "Not checked in"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {participants.length === 0 && !error && <p>No participants registered yet.</p>}
      {lastUpdated && <p style={{ color: "#94a3b8", fontSize: "12px" }}>Last updated: {lastUpdated.toLocaleTimeString()}</p>}
    </main>
  );
}

export default Dashboard;
