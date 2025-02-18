require('dotenv').config({ path: '.env.local' });
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

console.log('Environment variables loaded:', {
  port: process.env.PORT,
  supabaseUrl: process.env.SUPABASE_URL ? 'Set' : 'Not set',
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set'
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Import and use route handlers
const playersRouter = require('./pages/api/players');
app.use('/api/players', playersRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});