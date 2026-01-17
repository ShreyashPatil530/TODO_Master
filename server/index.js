const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ["https://todo-master-8oiw.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());

// Health check
app.get("/", (req, res) => res.send("Todo API is running..."));

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

