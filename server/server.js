const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

// Add this line to load Cloudinary configuration
require('./config/cloudinary');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: true, // Allow all origins temporarily for debugging
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Define routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

const petRoutes = require('./routes/petRoutes');
app.use('/api/pets', petRoutes);

const adoptionRoutes = require('./routes/adoptionRoutes');
app.use('/api/adoption', adoptionRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log('Server PORT:', process.env.PORT);
console.log('MongoDB URI:', process.env.MONGODB_URI);
console.log('CORS Origin:', process.env.CORS_ORIGIN || 'http://localhost:5173');

// Add this at the end of your file, after all routes
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Handle 404s
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
