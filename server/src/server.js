require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');

//Connect to MongoDB
connectDB();
const app = express();

//Middleware
app.use(cors());
app.use(express.json());  // parses incoming JSON request bodies
app.use(morgan('dev'));   // logs each request to the terminal

// Health check route - confirms the server is alive
app.get('/api/health', (req, res) => {
    res.json({status: 'ok', message: 'FitPilot API is running'});
});

app.use('/api/auth', authRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
