🌌 Nova Task Management System

The Nova Task Management System is a modern task management web application built using the MERN Stack.
It helps organizations efficiently manage workflows by allowing administrators to assign tasks and employees to track and update their progress in real time.

The system ensures clear communication, transparency, and productivity by centralizing task assignment and monitoring in a single platform.

📌 Core Functionality

The platform connects Administrators and Employees through a simple workflow.

Task Workflow
The Admin creates a task and assigns it to a specific employee.
The task includes priority level and deadline.
The Employee receives the task instantly on their dashboard.
The employee updates:
Task progress (0–100%)
Status (Pending / In Progress / Completed)
Notes or comments
All updates are immediately visible to the Admin dashboard.

This removes the need for emails or manual follow-ups.

🛠️ Technology Stack

This project is built using the MERN stack.

Frontend
React.js – For building the interactive user interface.
Tailwind CSS – For responsive and modern UI styling.
Backend
Node.js – Runtime environment for server-side development.
Express.js – Handles API routes and server logic.
Database
MongoDB – Stores users, tasks, and activity logs.
Mongoose – Schema-based database modeling.
Security
JWT (JSON Web Tokens) – Secure authentication system.
bcrypt – Password hashing for secure storage.
🚀 Key Features
1. User Authentication
Secure login and registration system
Password encryption using bcrypt
Token-based authentication using JWT
2. Role-Based Access
Admin
Assign tasks
View all employee progress
Monitor system activity
Employee
View assigned tasks
Update task progress
Add notes and comments
3. Task Management
Task creation with priority and deadlines
Progress tracking (0–100%)
Status updates (Pending, In Progress, Completed)
4. Activity Logs
Records user actions such as:
Login
Task assignment
Progress updates
Admins can view employee-specific activity logs
5. Search and Filtering

Admins can search employees by:

Name
Email
Age
⚙️ Installation & Setup
1️⃣ Backend Setup
cd taskmanager/backend
npm install

Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=development

Run the server:

npm run dev
2️⃣ Frontend Setup
cd taskmanager/frontend
npm install
npm start

The application will run at:

http://localhost:3000
🔑 Default Admin Access

For first-time access:

Email: admin@taskmanager.com
Password: admin123

After login, the admin can start assigning tasks to employees.

📈 Future Improvements
Email notifications for task updates
File attachments for tasks
Real-time updates using WebSockets
Advanced analytics dashboard

✅ Summary

The Nova Task Management System provides a secure, scalable, and efficient solution for managing organizational tasks using modern web technologies.
