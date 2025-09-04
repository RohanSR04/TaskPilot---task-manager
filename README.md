# TeamFlow - Collaborative Task Management Platform

TaskPilot is a comprehensive team task management application designed to streamline workflows, enhance collaboration, and boost productivity. With an intuitive interface and powerful features, TeamFlow helps teams organize, track, and complete projects efficiently.

## ✨ Features

### 📋 Task Management
- Create detailed tasks with titles, descriptions, and priorities
- Set due dates and times for better deadline management
- Add file attachments to tasks for comprehensive context
- Mark tasks as complete or important with a single click
- Sort and filter tasks based on priority and due dates
- Update or delete tasks with a simple, intuitive UI

### 💬 Comments & Attachments
- Add timestamped comments to tasks for collaborative feedback
- Attach documents and media files to relevant tasks
- Track comment activity and engagement metrics
- Maintain a complete history of task discussions

### 📊 Analytics Dashboard
- Visualize task statistics with multiple chart types (bar, pie, line, doughnut, scatter)
- Analyze task priorities, completion status, and importance markers
- Track productivity and activity trends over time
- Make data-driven decisions with comprehensive analytics

### 📧 Email Notifications
- Receive instant email alerts for task assignments, updates, and completions
- Stay informed with real-time notifications delivered to your inbox
- Reduce missed deadlines with proactive reminder system
- Enhance accountability with automated activity reporting

### 🔍 Smart Sorting & Filtering
- Filter tasks by priority levels (High, Medium, Low) and due dates
- Sort tasks by creation date or approaching deadlines
- Focus on urgent tasks with intelligent prioritization
- Customize views to match your workflow preferences

### 👥 Team Collaboration
- Invite teammates to shared workspaces
- Assign tasks to specific team members
- Track task ownership and progress across the team
- Manage team members with secure invitation system

### 🔐 Secure Authentication
- Token-based login system with password hashing
- Role-based access control for task management
- Secure user sessions managed with JWT tokens
- Protection against unauthorized access

### 📱 Mobile Responsive Design
- Fully responsive interface optimized for all devices
- Seamless experience on desktops, tablets, and mobile phones
- Built with Tailwind CSS for consistent styling
- Manage tasks on-the-go with mobile-friendly views

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- MongoDB 4.4+
- npm or yarn

### Installation
1. Clone the repository:
git clone https://github.com/yourusername/teamflow-task-manager.git
cd task-manager

Install dependencies:
1. npm install
2. cd frontend
   -> npm i
3. cd backend 
   -> npm i

Set up environment variables:
cp .env.example .env
# Edit .env with your configuration

Start frontend:
cd frontend 
npm start

Start the development server:
1. cd backend
   -> npx nodemon App.js
2. Open new powershell window 
3. cd backend
   -> npx nodemon server.js


🛠️ Built With
Frontend: React, Redux Toolkit, Tailwind CSS
Backend: Node.js, Express.js
Database: MongoDB with Mongoose ODM
Authentication: JWT
Notifications: Nodemailer for email alerts
Charts: Chart.js for analytics visualization
Attachments: Cloudinary


📁 Project Structure

TaskPilot - task-manager/
├── 📁 backend/                    # Node.js + Express Server
│   ├── 📁 conn/                   # Database connection configuration
│   ├── 📁 models/                 # MongoDB Mongoose Models & Schemas
│   ├── 📁 routes/                 # Express API Routes & Controllers
│   ├── 📁 utils/                  # Utility/Helper functions (e.g., email)
│   ├── 🗋 .env                    # Environment variables
│   ├── 🗋 app.js                  # Express app configuration
│   ├── 🗋 package.json            # Backend dependencies & scripts
│   ├── 🗋 package-lock.json       # Backend dependency lockfile
│   ├── 🗋 server.js               # Server entry point
│   └── 🗋 taskscheduler.js        # Background task/cron job logic
│
└── 📁 frontend/                   # React Application
    ├── 📁 public/                 # Static assets (HTML, images, etc.)
    │   └── 🗋 logo.svg             # App logo
    ├── 📁 src/
    │   ├── 📁 assets/             # Other static assets (fonts, icons)
    │   ├── 📁 components/         # Reusable React components
    │   ├── 📁 pages/              # Main page components
    │   ├── 📁 store/              # State management (Redux/Context)
    │   ├── 🗋 App.css             # Main application styles
    │   ├── 🗋 App.js              # Root React component
    │   ├── 🗋 App.test.js         # Tests for the App component
    │   ├── 🗋 index.css           # Global styles
    │   └── 🗋 index.js            # React DOM rendering entry point
    ├── 🗋 package.json            # Frontend dependencies & scripts
    └── 🗋 package-lock.json       # Frontend dependency lockfile


🤝 Contributing
We welcome contributions! Please read our Contributing Guidelines for details on our code of conduct and the process for submitting pull requests.

⭐ Star this project on GitHub if you find TaskPilot helpful for your team's productivity!
