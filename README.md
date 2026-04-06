





# 🌌 Nova Task Management System

Hey there! Welcome to the **Nova Task Management System**. 

If you're looking for a generic, boring spreadsheet clone, you're in the wrong place. We built this from the ground up as a fully modernized, ultra-sleek **MERN stack** (MongoDB, Express, React, Node.js) web application. Our goal was to create a dark-mode, synthwave-inspired platform that makes managing corporate workflow feel like operating a starship console.

# What does it do?

At its core, this platform acts as a digital bridge between **Administrators** (managers) and **Employees** (agents). 

**How it works seamlessly:** 
1. The **Admin** defines a major operation (a task), selects an employee from their roster, sets a priority, and dictates a deadline.
2. The deployed task instantly appears on the **Employee's** secure dashboard. 
3. The Employee can begin work, scrub a progress slider (0 to 100%), and attach encrypted notes as they execute the mission.
4. Any activity—changing a status to "In Progress," leaving a note, or finishing the task—is instantly reflected back on the Admin's Master Operations panel. 

No emails. No phone calls. Just pure, bi-directional transparency.

---

## 🛠️ The Tech Stack (MERN)

We used some of the best tools in the industry to make this fast and secure:
- **MongoDB & Mongoose**: For flexible, schema-driven data storage. It holds our User records, Tasks, and Activity Logs.
- **Express.js & Node.js**: The backend server engine that handles all our API routes, business logic, and database operations.
- **React.js**: Our interactive frontend interface. We went heavy on modern hooks and modular components to make the UI lightning-fast.
- **Tailwind CSS**: The secret behind our beautiful dark-synthwave aesthetic. We didn't use any pre-built templates—every card, button, and glassmorphism effect is custom tailored.
- **JSON Web Tokens (JWT) & bcrypt**: Complete security. Passwords are hashed unconditionally, and users must carry secure tokens to execute any API calls.

---

## 🚀 Features We Just Added!

We didn't just build a basic app; we completely overhauled it with highly advanced mechanics:

1. **Intense Cyberpunk Aesthetic**
   - We ripped out the old standard backgrounds and locked the system into a permanent, sleek dark mode (`bg-zinc-950`) accented with vibrant neon brand colors.
2. **Split-Screen Authentication System**
   - A beautiful side-by-side login and registration interface that looks professional and welcoming.
3. **Age Verification & Granular Employee Search**
   - Employees now provide their age on registration. 
   - Admins can instantly search their roster by Name, Email, or Age!
4. **Isolated "Execution Logs"**
   - The platform strictly logs every single action taken (login, task assignment, progress update). 
   - *New upgrade:* Admins can click directly onto an employee's profile to view an isolated timeline of *only* what that specific employee has been doing. Employees can also see their own personal logs!
5. **Bi-Directional Task Transparency**
   - **For Employees**: An "Active Directives" grid layout with custom progress bars and priority badges.
   - **For Admins**: A "Master Operations" grid that explicitly mirrors the exact notes and progress updates left by the employee, so nothing is ever lost in translation.

---

## ⚙️ How to Get It Running (What You Need)

Ready to launch the system? You'll need **Node.js** installed on your machine and a **MongoDB URI** (either local or Atlas).

### Step 1: Boot up the Backend Database

1. Open your terminal and jump into the backend: `cd taskmanager/backend`
2. Install the necessary server packages: `npm install`
3. Duplicate the `.env.example` file and rename it to `.env`. 
4. Inside `.env`, paste your `MONGO_URI` and a secure `JWT_SECRET`.
5. Ignite the server: `npm run dev`

*(The backend is now listening on port 5000).*

### Step 2: Initialize the Frontend UI

1. Open a new terminal tab and dive into the frontend: `cd taskmanager/frontend`
2. Install the React dependencies: `npm install`
3. Launch the visual interface: `npm start`

*(Your browser will open to `http://localhost:3000` automatically).*

### Step 3: Command Access

The system intelligently detects if an Admin exists yet. Upon initial launch, you can use these default keys to access the Master Dashboard:

- **Email**: admin@taskmanager.com
- **Password**: admin123

Login, assign a task, and start managing your empire. Enjoy!
