const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const Agenda = require('agenda');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/authRoutes');
const sequenceRoutes = require('./routes/sequenceRoutes');

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

// Initialize Agenda (job scheduler)
const agenda = new Agenda({
  db: { address: process.env.MONGO_URI, collection: 'jobs' },
  processEvery: '30 seconds',
});

// Make agenda available globally
app.locals.agenda = agenda;

// Import email service and define jobs
const emailService = require('./services/emailService');
emailService.defineJobs(agenda);

// Start agenda
(async function() {
  await agenda.start();
  console.log('Agenda job scheduler started');
})();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sequences', sequenceRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Email Sequence API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));