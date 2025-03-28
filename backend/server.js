require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const { createUploadDirectories } = require('./utils/fs.utils');
const authRoutes = require('./routes/auth.routes');
const carOwnerRoutes = require('./routes/carOwner.routes');
const driverRoutes = require('./routes/driver.routes');
const carpoolRoutes = require('./routes/carpool.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Create upload directories
createUploadDirectories();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/car-owner', carOwnerRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/carpool', carpoolRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('CarConnect API is running...');
});

// Error handler
app.use(errorHandler);

// Database connection
mongoose.connect('mongodb://localhost:27017/CarConnect-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });
