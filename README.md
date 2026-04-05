# 🏦 Zovryn Finance Dashboard - Fullstack Node.js & React Project

A robust, full-stack financial management system featuring a **Node.js/Express backend** and a **React/Vite frontend**. This project handles financial record-keeping, user role management, and provides real-time dashboard analytics with integrated RBAC (Role-Based Access Control).

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (Local instance or MongoDB Atlas)

### 2. Backend Setup
```bash
cd backend
npm install
```
- Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/finance_dashboard
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```
- Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Access the application at: `http://localhost:5173`

---

## 🛠 Tech Stack

### Backend
- **Node.js & Express.js**: Core API framework.
- **MongoDB & Mongoose**: NoSQL database and ODM.
- **JWT (JSON Web Token)**: Secure authentication.
- **Bcrypt.js**: Password hashing.
- **Joi**: Request validation.
- **Morgan & Helmet**: Logging and security headers.

### Frontend
- **React 19 (Vite)**: Modern UI framework.
- **Recharts**: For dashboard visualizations.
- **Lucide React**: For premium iconography.
- **Axios**: API communication.
- **Vanilla CSS**: Premium dark-mode glassmorphism design.

---

## 📂 Project Structure

```text
Zovryn/
├── backend/
│   ├── src/
│   │   ├── config/       # DB Connection
│   │   ├── controllers/  # API Logic
│   │   ├── middleware/   # Auth & Error Handling
│   │   ├── models/       # Mongoose Schemas
│   │   ├── routes/       # API Endpoints
│   │   └── index.js      # App Entry
│   └── .env              # Environment Config
└── frontend/
    ├── src/
    │   ├── context/      # Auth State Management
    │   ├── pages/        # Dashboard, Records, Auth
    │   ├── utils/        # API configuration
    │   └── App.jsx       # Routing & Layout
```

---

## 📡 API Documentation

### 🔓 Authentication
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user with a specified role. |
| `POST` | `/api/auth/login` | Public | Authenticate and receive a JWT Bearer token. |

### 👤 User Management
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users` | Admin | Fetch all registered users. |
| `POST` | `/api/users` | Admin | Create a new user manually. |
| `PUT` | `/api/users/:id` | Admin | Update user details (role, status, etc). |
| `DELETE` | `/api/users/:id` | Admin | Remove a user from the system. |

### 📊 Financial Records
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/records` | All | Fetch records with pagination & filtering. |
| `POST` | `/api/records` | Admin/Analyst | Add a new financial entry (income/expense). |
| `PUT` | `/api/records/:id` | Admin/Analyst | Edit an existing record. |
| `DELETE` | `/api/records/:id` | Admin/Analyst | Permanently delete a record. |

### 📈 Dashboard Analytics
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/summary` | All | Total income, expense, and current balance. |
| `GET` | `/api/dashboard/trends` | Admin/Analyst | Monthly financial growth and trend data. |

---

## 🔐 Role-Based Access Control (RBAC)

| Feature | Admin | Analyst | Viewer |
| :--- | :---: | :---: | :---: |
| View Records | ✅ | ✅ | ✅ |
| Add/Edit Records | ✅ | ✅ | ❌ |
| Dashboard Summary | ✅ | ✅ | ✅ |
| Dashboard Trends | ✅ | ✅ | ❌ |
| User Management | ✅ | ❌ | ❌ |

---

## 🧪 Testing the Application

### Using the Frontend
1. **Register**: Navigate to the Register page and create an account. You can choose any role (**Admin** is recommended for full testing).
2. **Dashboard**: Observe the charts and cards reflecting real-time data from MongoDB.
3. **Records**: Try adding, editing, and deleting records. Use the search bar to filter by category.
4. **Users**: If logged in as Admin, manage the system's users.

### Using Postman
1. Set the `Authorization` header to `Bearer <YOUR_TOKEN>`.
2. Use the endpoints listed in the API Documentation section above.
3. All write operations (`POST`, `PUT`, `DELETE`) require a valid JWT with appropriate permissions.

---

## 📄 License
This project was developed as a technical assignment. All rights reserved.
