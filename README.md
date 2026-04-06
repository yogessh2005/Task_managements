# TaskFlow — Admin & Employee Task Management System
A full-stack MERN application with two separate portals: Admin and Employee.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)

---

### 1. Clone & Setup Backend

```bash
cd taskmanager/backend
npm install
cp .env.example .env
# Edit .env: set your MONGO_URI and JWT_SECRET
npm run dev
```

Backend runs on: http://localhost:5000

---

### 2. Setup Frontend

```bash
cd taskmanager/frontend
npm install
npm start
```

Frontend runs on: http://localhost:3000

---

## 🔐 Default Admin Login

| Field    | Value                    |
|----------|--------------------------|
| Email    | admin@taskmanager.com    |
| Password | admin123                 |

The admin is auto-created on first server start.

---

## 📁 Project Structure

```
taskmanager/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   └── employeeController.js
│   ├── middleware/auth.js     # JWT middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Task.js
│   │   └── ActivityLog.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   └── employee.js
│   ├── .env.example
│   └── server.js
│
└── frontend/
    ├── public/index.html
    └── src/
        ├── context/AuthContext.js
        ├── layouts/
        │   ├── AdminLayout.js
        │   └── EmployeeLayout.js
        ├── pages/
        │   ├── LoginPage.js
        │   ├── RegisterPage.js
        │   ├── AdminDashboard.js
        │   ├── AdminEmployees.js
        │   ├── AdminTasks.js
        │   ├── AdminActivityLog.js
        │   ├── EmployeeDashboard.js
        │   └── EmployeeTasks.js
        ├── services/api.js
        └── App.js
```

---

## 🔗 REST API Endpoints

### Auth
| Method | Route             | Description        |
|--------|-------------------|--------------------|
| POST   | /api/auth/register | Employee register  |
| POST   | /api/auth/login    | Login (all roles)  |

### Admin (requires admin JWT)
| Method | Route                           | Description            |
|--------|---------------------------------|------------------------|
| GET    | /api/admin/dashboard            | Stats & activity log   |
| GET    | /api/admin/employees            | List employees         |
| PUT    | /api/admin/employees/:id/approve | Approve/reject employee|
| POST   | /api/admin/tasks                | Assign task            |
| GET    | /api/admin/tasks                | All tasks              |
| DELETE | /api/admin/tasks/:id            | Delete task            |

### Employee (requires employee JWT)
| Method | Route                  | Description         |
|--------|------------------------|---------------------|
| GET    | /api/employee/tasks    | My tasks            |
| PUT    | /api/employee/tasks/:id | Update task status  |
| GET    | /api/employee/stats    | My task stats       |

---

## ✨ Features

- **Admin Portal**: Dashboard with stats, employee approval, task assignment with priority & deadline, activity log, search & filter
- **Employee Portal**: View tasks, update status (Pending/In Progress/Completed), progress bar, add notes
- **Auth**: JWT-based authentication, bcrypt password hashing
- **UI**: Tailwind CSS, dark mode toggle, responsive design, modern sidebar layout
