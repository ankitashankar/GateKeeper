
import { useEffect, useState } from "react";
import "../pages/Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    checkedIn: 0,
    pending: 0,
  });

  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch attendance data from backend
  const fetchAttendance = async () => {
    try {
      setLoading(true);

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
      setError(
        "Unable to connect to the backend. Check that the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // Automatically refresh attendance every 3 seconds
  useEffect(() => {
    fetchAttendance();

    const interval = setInterval(fetchAttendance, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        {/* Header */}
        <header className="dashboard-header">
          <div>
            <h1>GateKeeper</h1>
            <p>Organiser Attendance Dashboard</p>
          </div>

          <button
            className="dashboard-refresh-button"
            onClick={fetchAttendance}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh Attendance"}
          </button>
        </header>

        {/* Dashboard heading */}
        <section className="dashboard-heading">
          <h2>Attendance Overview</h2>
          <p>
            Monitor registrations, student check-ins and attendance
            in real time.
          </p>
        </section>

        {/* Error message */}
        {error && (
          <div className="dashboard-error" role="alert">
            {error}
          </div>
        )}

        {/* Attendance Statistics */}
        <section className="dashboard-stats">

          <div className="dashboard-stat-card">
            <p>Total Participants</p>
            <h2>{stats.total}</h2>
            <span>Registered students</span>
          </div>

          <div className="dashboard-stat-card checked-stat">
            <p>Checked In</p>
            <h2>{stats.checkedIn}</h2>
            <span>Successfully scanned QR codes</span>
          </div>

          <div className="dashboard-stat-card pending-stat">
            <p>Awaiting Check-in</p>
            <h2>{stats.pending}</h2>
            <span>Students yet to check in</span>
          </div>

        </section>

        {/* Participant Attendance Table */}
        <section className="dashboard-table-card">

          <div className="dashboard-table-heading">
            <div>
              <h3>Participant Attendance</h3>
              <p>
                Pending means registered but not yet successfully
                checked in using QR.
              </p>
            </div>

            <span className="participant-count">
              {participants.length} Participants
            </span>
          </div>

          <div className="table-responsive">
            <table className="attendance-table">

              <thead>
                <tr>
                  <th>Name</th>
                  <th>USN</th>
                  <th>Email</th>
                  <th>Status / Reason</th>
                  <th>Check-in Time</th>
                </tr>
              </thead>

              <tbody>
                {participants.map((person) => (
                  <tr key={person._id}>

                    <td className="participant-name">
                      {person.name}
                    </td>

                    <td>
                      {person.usn || "—"}
                    </td>

                    <td>
                      {person.email}
                    </td>

                    <td>
                      {person.checkedIn ? (
                        <span className="attendance-status status-checked">
                          Checked In
                        </span>
                      ) : (
                        <span className="attendance-status status-pending">
                          Pending
                        </span>
                      )}
                    </td>

                    <td>
                      {person.checkInTime
                        ? new Date(
                            person.checkInTime
                          ).toLocaleString()
                        : "Not checked in"}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          {/* Empty state */}
          {participants.length === 0 && !error && (
            <div className="empty-attendance">
              <h3>No participants yet</h3>
              <p>Registered students will appear here.</p>
            </div>
          )}

        </section>

        {/* Footer */}
        <footer className="dashboard-footer">
          {lastUpdated
            ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
            : "Loading attendance data..."}

          {" · "}Auto-refreshes every 3 seconds
        </footer>

      </div>
    </main>
  );
}

export default Dashboard;
