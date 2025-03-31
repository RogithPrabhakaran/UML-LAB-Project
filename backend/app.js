// app.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./db');
const bodyParser = require('body-parser');

// Import Models
const User = require('./src/models/userModel');

const userRoutes = require('./src/routes/userRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);

// Health Check Route
app.get('/', (req, res) => {
  res.send('Companion Backend is running.');
});

// Synchronize models and start the server
const PORT = process.env.PORT || 5000;

sequelize
  .sync({ alter: true, force: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
  });
