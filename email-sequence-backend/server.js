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

const isServerless = process.env.VERCEL === '1';

let agenda;
if (!isServerless) {
  agenda = new Agenda({
    db: { address: process.env.MONGO_URI, collection: 'jobs' },
    processEvery: '30 seconds',
  });


  app.locals.agenda = agenda;


  const emailService = require('./services/emailService');
  emailService.defineJobs(agenda);

  // Start agenda
  (async function() {
    await agenda.start();
    console.log('Agenda job scheduler started');
  })();
} else {
  console.log('Running in serverless environment, using mock agenda');
  app.locals.agenda = {
    schedule: () => console.log('Agenda scheduling bypassed in serverless environment'),
    now: () => console.log('Agenda immediate job bypassed in serverless environment')
  };
}

// Middleware
app.use(express.json());

// Configure CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sequences', sequenceRoutes);


app.get('/', (req, res) => {
  res.send('Email Sequence API is running');
});


if (!isServerless) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;