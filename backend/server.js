require('dotenv').config({ path: '.env.local' });
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Import and use route handlers
app.use('/api/players', require('./pages/api/players'));
app.use('/api/games', require('./pages/api/games'));
app.use('/api/users', require('./pages/api/users'));
app.use('/api/stripe-webhook', require('./pages/api/stripe-webhook'));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});