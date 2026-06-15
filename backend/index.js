const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');

// Set DNS servers to prevent querySrv ECONNREFUSED issues on some networks/systems
dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const studentRoutes = require('./routes/studentRoutes');
const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/first_mern';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully.'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Router Middleware
app.use('/users', userRoutes);
app.use('/student', studentRoutes);
// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
