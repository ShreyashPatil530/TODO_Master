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
    origin: "*", // Temporarily allow all for debugging
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
let isConnected = false;

const connectToDB = async () => {
    if (isConnected) return;
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        isConnected = db.connections[0].readyState;
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
    }
};

// Middleware to ensure DB is connected
app.use(async (req, res, next) => {
    await connectToDB();
    next();
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;

