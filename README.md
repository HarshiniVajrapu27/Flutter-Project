# Skill Sharing Among Villagers

A modern, responsive, and user-friendly web portal designed for rural communities to connect skilled trainers with learners. It enables villagers to teach traditional or vocational trades locally, promoting local employment and rural self-reliance. This project is optimized for presentation as a final-year **Community Service Project (CSP)**.

---

## 🌟 Key Features

* **Bi-directional Routing & Directory**: Real-time filters to search trainers by specific skills, villages, or spoken languages.
* **18 Vocational and Traditional Skills**: Pre-configured cards (e.g. Tailoring, Spoken English, Organic Farming, Coding, Mobile Repairing) with dedicated illustrations.
* **Unified Dashboard**: Customized panels based on user roles:
  * **Admin Panel**: Track system analytical stats, approve/verify pending trainer accounts, delete users, and publish community events/workshops.
  * **Trainer Panel**: Edit public listing slots, accept or decline booking requests, mark sessions completed, and calculate estimated earnings.
  * **Learner Panel**: Request training sessions, view booking statuses, and manage favorite trainers.
* **Multilingual Support**: Fully localized in **English** and **Telugu (తెలుగు)** with one-click toggles.
* **Dark / Light Mode**: Sleek dark and light styling matching modern design standards.
* **Zero-Config Database Fallback**: Dynamically connects to a local MongoDB instance. If MongoDB is offline, it automatically falls back to an internal file database (`server/data/local_db.json`) seeded with beautiful mock records.

---

## 🚀 How to Run the Project

Since we installed Node.js locally in the environment, you can run the project using standard commands.

### 1. Start Both Client and Server Concurrently

Open a PowerShell terminal in the project root directory and run:

```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
$env:Path = "C:\Users\harsh\.gemini\antigravity-ide\node\node-v22.12.0-win-x64;" + $env:Path
npm run dev
```

This will concurrently boot:
* **Frontend client**: [http://localhost:5173](http://localhost:5173)
* **Backend API**: [http://localhost:5000](http://localhost:5000)

### 2. Available Seed Accounts for Testing

To test different role dashboards, use the following pre-registered credentials:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@skillsharing.org` | `admin123` | RAMESH KUMAR - Penugonda Coordinator |
| **Trainer** | `satya.farmer@gmail.com` | `admin123` | SATYANARAYANA MURTHY - Organic Farming (Verified) |
| **Trainer (Pending)** | `prasad.english@gmail.com` | `admin123` | PRASAD RAO - Spoken English (Awaiting Admin verification) |
| **Learner** | `kalyan@gmail.com` | `admin123` | KALYAN RAJU - penugonda learner |

---

## 📂 Project Structure

```text
├── client/                     # React Frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Navbar, Footer, BookingModal
│   │   ├── context/            # Auth, Theme, and Language Contexts
│   │   ├── pages/              # Home, About, Skills, Trainer Directory, Profile, Dashboards
│   │   ├── index.css           # Design system configuration
│   │   └── App.jsx             # React routing table
│   └── package.json
├── server/                     # Node.js + Express Backend
│   ├── config/                 # db.js (MongoDB / JSON fallback handler)
│   ├── data/                   # local_db.json (fallback records)
│   ├── middleware/             # auth.js (JWT validation)
│   ├── routes/                 # Express API routes
│   └── index.js                # Express entrypoint
└── package.json                # Monorepo concurrent script runners
```

---

## 🎨 Technology Stack

* **Frontend**: React.js (Vite compiler), Tailwind CSS v4, Lucide-React.
* **Backend**: Node.js, Express.js.
* **Authentication**: JWT tokens with local storage caching.
* **Database**: MongoDB (Mongoose) with a file-based JSON storage fallback.
