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
```
- Create a `.env` file in the `frontend/` directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```
- Start the frontend:
```bash
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
- **Helmet**: Security headers (CORS & CSP optimized).
- **Morgan**: Request logging.

### Frontend
- **React 19 (Vite)**: Modern UI framework.
- **Recharts**: Advanced data visualization library.
- **Lucide React**: Premium iconography.
- **Vanilla CSS**: High-end dark-mode glassmorphism design.
- **Typography**: Plus Jakarta Sans (Google Fonts).

---

## 🔥 Key Features

- **Advanced Filtering**: Filter records by User (Admins), Category (Regex search), and Timeline (Date range).
- **Interactive Dashboard**: Real-time summary cards and trend analysis charts.
- **Category Insights**: Visual breakdown of expenditure and income allocation (Pie & Bar Charts).
- **Role-Based Security**: Grainular access control (Admin, Analyst, Viewer).
- **Premium User Experience**: Glassmorphism UI, smooth transitions, and responsive design.

---

## 📂 Project Structure

```text
Zovryn/
├── backend/
│   ├── src/
│   │   ├── config/       # DB Connection
│   │   ├── controllers/  # API Logic (Aggregation Pipelines, CRUD)
│   │   ├── middleware/   # Auth (JWT, RBAC) & Error Handling
│   │   ├── models/       # Mongoose Schemas (User, Record)
│   │   ├── routes/       # API Endpoints
│   │   └── index.js      # App Entry (CORS Whitelisting)
│   └── .env              # Environment Config
└── frontend/
    ├── src/
    │   ├── context/      # Auth State Management
    │   ├── pages/        # Dashboard (Analytics), Records (Filters), Auth, Users
    │   ├── utils/        # Axios API Configuration
    │   └── App.jsx       # Routing & Layout
```

---

## 📡 API Documentation

### 🔓 Authentication
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user with a specified role. |
| `POST` | `/api/auth/login` | Public | Authenticate and receive a JWT Bearer token. |

### 📊 Financial Records
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/records` | All | Fetch records with Advanced Filtering. |
| `POST` | `/api/records` | Admin/Analyst | Add a new financial entry. |
| `PUT` | `/api/records/:id` | Admin/Analyst | Edit an existing record. |
| `DELETE` | `/api/records/:id` | Admin/Analyst | Permanently delete a record. |

### 📈 Dashboard Analytics
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/summary` | All | Total income, expense, and current balance. |
| `GET` | `/api/dashboard/trends` | All | Monthly financial growth and trend data. |
| `GET` | `/api/dashboard/categories`| All | Categorical spending breakdown. |

---

## 🔐 Role-Based Access Control (RBAC)

| Feature | Admin | Analyst | Viewer |
| :--- | :---: | :---: | :---: |
| View Records | ✅ | ✅ | ✅ |
| Add/Edit Records | ✅ | ✅ | ❌ |
| Dashboard Summary | ✅ | ✅ | ✅ |
| Dashboard Trends | ✅ | ✅ | ✅ |
| Category Analysis | ✅ | ✅ | ✅ |
| User Management | ✅ | ❌ | ❌ |

---

## 📄 License
This project was developed as a technical assignment. All rights reserved.
