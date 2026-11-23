# 🔐 GateKeeper – QR-Based Event Registration & Attendance Management System

## 📌 About the Project

GateKeeper is a QR-based event registration and attendance management system developed for ALPHA Lab.

The system simplifies the event registration and check-in process by allowing students to register online and receive a unique QR code. The QR code can be scanned during the event to verify participants and record their attendance.

The main objective is to make event registration faster, easier and more efficient while preventing duplicate registrations and check-ins.

## 🎯 Objectives

- Simplify student event registration.
- Generate unique QR codes for registered participants.
- Store participant information securely in a database.
- Enable quick QR-based attendance verification.
- Prevent duplicate registrations and check-ins.
- Provide organisers with attendance statistics.

## ✨ Key Features

### 1. Student Registration
- User-friendly student registration form.
- Collects name, USN, email, phone number and event name.
- Validates student information.
- Prevents duplicate registrations for the same event.

### 2. QR Code Generation
- Generates a unique registration ID.
- Creates a unique QR code for every successful registration.
- Allows participants to view and download their QR codes.

### 3. QR Code Verification
- Scans participant QR codes.
- Verifies registered participants.
- Prevents duplicate check-ins.
- Records check-in timestamps.

### 4. Organiser Dashboard
- Displays participant information.
- Shows total registered participants.
- Displays checked-in and pending participants.
- Provides attendance statistics.

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js |
| Styling | CSS |
| Backend | Node.js |
| Backend Framework | Express.js |
| Database | MongoDB Atlas |
| QR Code Generation | QRCode npm package |
| Version Control | Git and GitHub |

## 🏗️ System Architecture

The application follows a client-server architecture.

1. Students enter their details through the React frontend.
2. The frontend sends registration data to the Express backend.
3. The backend validates the information.
4. MongoDB stores the participant details.
5. A unique registration ID and QR identifier are generated.
6. The frontend displays the generated QR code.
7. During the event, the QR scanner sends the scanned identifier to the backend.
8. The backend verifies the participant and updates attendance information.
9. The organiser dashboard displays attendance statistics.

## 📂 Project Structure

```text
GateKeeper/
│
├── backend/
│   ├── models/
│   │   └── Participant.js
│   ├── routes/
│   │   └── registration.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── QRScanner.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── pages/
│   │   │   ├── Registration.jsx
│   │   │   └── Registration.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

Install the following before running the project:

- Node.js
- npm
- MongoDB Atlas account
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/ankitashankar/GateKeeper.git
```

```bash
cd GateKeeper
```

### Step 2: Configure the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Replace the MongoDB connection string with your own credentials.

### Step 3: Start the Backend

```bash
node server.js
```

The backend runs at:

`http://localhost:5000`

### Step 4: Configure the Frontend

Open another terminal:

```bash
cd frontend
npm install
```

### Step 5: Start the Frontend

```bash
npm run dev
```

Open the local URL displayed in the terminal, usually:

`http://localhost:5173`

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/registration/register` | Register a new participant |
| POST | `/api/verify` | Verify QR code and mark attendance |
| GET | `/api/attendance/stats` | Retrieve attendance statistics |
| GET | `/api/participants` | Retrieve participant information |
| GET | `/` | Check backend server status |

### Registration Request Example

```json
{
  "name": "Student Name",
  "usn": "YOUR_USN",
  "email": "student@example.com",
  "phone": "9876543210",
  "eventName": "ALPHA Lab Recruitment"
}
```

## 🔒 Security and Validation

- Input validation for registration fields.
- Unique registration IDs.
- Unique QR identifiers.
- Duplicate registration prevention using database constraints.
- Duplicate check-in prevention using atomic database updates.
- Database credentials are stored in environment variables and should not be committed to GitHub.

## 👥 Team Contributions

**Member 1 – Student Registration Module**
- Developed the student registration interface.
- Implemented frontend and backend validation.
- Integrated MongoDB for participant data storage.
- Implemented unique registration ID generation.
- Implemented QR code generation and display.
- Added duplicate registration prevention.

**Member 2 – QR Scanning and Organiser Dashboard**
- Developed the QR scanning interface.
- Implemented QR verification.
- Added duplicate check-in prevention.
- Developed the organiser dashboard.
- Implemented attendance statistics and participant listing.

## 🧠 What We Learned

Through this project, we gained practical experience in:

- React frontend development.
- Node.js and Express backend development.
- MongoDB database integration.
- REST API development and integration.
- QR code generation and verification.
- Input validation and database constraints.
- Git and GitHub collaboration.
- Teamwork and problem-solving.

## 🤖 AI Tools and Development Resources

AI tools were used as development assistance for understanding technical concepts, debugging errors, improving code and documentation.

Development resources included:
- ChatGPT – Technical guidance, debugging assistance and documentation support.
- Visual Studio Code – Code development.
- GitHub – Version control and team collaboration.
- MongoDB Atlas – Cloud database management.

All implementation and integration work was reviewed and tested by the team.

## 🚀 Future Enhancements

- Real-time attendance monitoring.
- Export attendance reports to Excel or PDF.
- Improved organiser authentication.
- Enhanced dashboard analytics.
- Support for multiple events.
- Deployment to a cloud hosting platform.

## 📌 Conclusion

GateKeeper provides a simple and efficient approach to event registration and attendance management using QR code technology. It reduces manual registration work, improves check-in efficiency and provides organisers with an organised way to manage participant attendance.

---

**Project:** GateKeeper  
**Developed for:** ALPHA Lab  
**Repository:** https://github.com/ankitashankar/GateKeeper
