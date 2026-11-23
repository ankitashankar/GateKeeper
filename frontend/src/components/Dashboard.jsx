
import { useEffect, useState } from "react";

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    checkedIn: 0,
    pending: 0,
  });

  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState("");

  const fetchAttendance = async () => {
    try {
      const [statsResponse, participantsResponse] =
        await Promise.all([
          fetch("http://localhost:5000/api/attendance/stats"),
          fetch("http://localhost:5000/api/participants"),
        ]);

      if (!statsResponse.ok || !participantsResponse.ok) {
        throw new Error("Could not load attendance data");
      }

      const statsData = await statsResponse.json();
      const participantsData = await participantsResponse.json();

      setStats(statsData);
      setParticipants(participantsData);
      setError("");
    } catch (err) {
      setError("Unable to connect to the backend.");
    }
  };

  useEffect(() => {
    fetchAttendance();

    const interval = setInterval(fetchAttendance, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Organiser Attendance Dashboard</h2>

      <button onClick={fetchAttendance}>
        Refresh Attendance
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{
        display: "flex",
        gap: "15px",
        flexWrap: "wrap",
        marginTop: "20px"
      }}>
        <div>
          <h3>Total Participants</h3>
          <h2>{stats.total}</h2>
        </div>

        <div>
          <h3>Checked In</h3>
          <h2 style={{ color: "green" }}>
            {stats.checkedIn}
          </h2>
        </div>

        <div>
          <h3>Pending</h3>
          <h2 style={{ color: "orange" }}>
            {stats.pending}
          </h2>
        </div>
      </div>

      <h3>Participant Attendance</h3>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Check-in Time</th>
          </tr>
        </thead>

        <tbody>
          {participants.map((person) => (
            <tr key={person._id}>
              <td>{person.name}</td>
              <td>{person.email}</td>
              <td>
                {person.checkedIn ? "Checked In" : "Pending"}
              </td>
              <td>
                {person.checkInTime
                  ? new Date(person.checkInTime).toLocaleString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {participants.length === 0 && (
        <p>No participants registered yet.</p>
      )}
    </div>
  );
}

export default Dashboard;
