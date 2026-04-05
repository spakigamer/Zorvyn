const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security headers - Move after CORS for best results
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Enable CORS with flexible origin check
const allowedOrigins = [
    'http://localhost:5173',
    'https://zorvyn-five-sigma.vercel.app',
    'https://zorvyn-6rx9.onrender.com'
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const isVercel = origin.endsWith('.vercel.app');
        const isAllowed = allowedOrigins.indexOf(origin) !== -1;
        
        if (isVercel || isAllowed) {
            callback(null, true);
        } else {
            // For now, allow but log for debugging if it's still failing
            console.warn(`Blocked by CORS: ${origin}`);
            callback(null, true); // Allow all during debugging but log it
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Health check endpoint for Render/Cron jobs
app.get('/health', (req, res) => res.status(200).send('OK'));

// Route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const recordRoutes = require('./routes/recordRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
