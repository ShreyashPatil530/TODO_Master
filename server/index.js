const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // In development, allow localhost. In production, you might want to restrict this.
        if (origin.startsWith('http://localhost') || origin.includes('vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());

// Explicit Root Route
app.get("/", (req, res) => {
    res.json({ message: "Todo API is live and well!", status: "Connected" });
});

// Routes
const todoRoutes = require('./routes/todos');
app.use('/api/todos', todoRoutes);

// MongoDB connection with caching for serverless
let cachedDb = null;

const connectToDB = async () => {
    if (cachedDb && mongoose.connection.readyState === 1) {
        return cachedDb;
    }

    try {
        console.log('Connecting to MongoDB...');
        const db = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        cachedDb = db;
        console.log('MongoDB connected successfully');
        return db;
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        throw err;
    }
};

// Middleware to ensure DB is connected
app.use(async (req, res, next) => {
    try {
        await connectToDB();
        next();
    } catch (err) {
        res.status(500).json({ error: "Database connection failed" });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;

