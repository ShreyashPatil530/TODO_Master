const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const todoRoutes = require('./routes/todos');
app.use('/api/todos', todoRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
        if (process.env.NODE_ENV !== 'production') {
            app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        }
    })
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        console.error('Full error:', err);
    });

module.exports = app;
