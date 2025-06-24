const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Check if dist folder exists
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.warn('⚠️  Warning: dist folder not found!');
  console.log('📦 Please run "npm run build" first to create the production build.');
  console.log('🔧 For development, run "npm run watch" in another terminal.\n');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(distPath));

// Facts API endpoint - proxy to external API
app.get('/api/facts/random', async (req, res) => {
  try {
    const response = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random', {
      params: { language: req.query.language || 'en' }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching fact:', error);
    res.status(500).json({ error: 'Failed to fetch fact' });
  }
});

// Today's fact endpoint
app.get('/api/facts/today', async (req, res) => {
  try {
    const response = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/today', {
      params: { language: req.query.language || 'en' }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching today\'s fact:', error);
    res.status(500).json({ error: 'Failed to fetch today\'s fact' });
  }
});

// Mock authentication endpoint
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  // Sanitize input (prevent XSS)
  const sanitizedUsername = username.replace(/[<>]/g, '');
  
  // Mock authentication (in real app, check against database)
  if (password.length >= 6) {
    res.json({ 
      success: true, 
      token: 'mock-jwt-token',
      user: { username: sanitizedUsername }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Quiz results endpoint (for additional functionality)
app.post('/api/quiz/submit', (req, res) => {
  const { answers } = req.body;
  
  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Invalid quiz submission' });
  }
  
  // Calculate score (mock implementation)
  const score = answers.filter(a => a.correct).length;
  const total = answers.length;
  
  res.json({
    score,
    total,
    percentage: Math.round((score / total) * 100)
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send(`
      <html>
        <head>
          <title>Build Required</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 50px; text-align: center; }
            .container { max-width: 600px; margin: 0 auto; }
            code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
            .command { background: #333; color: #fff; padding: 10px; border-radius: 5px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>📦 Build Required</h1>
            <p>The application needs to be built first.</p>
            <p>Please run the following command:</p>
            <div class="command">npm run build</div>
            <p>Or for development mode:</p>
            <div class="command">npm run watch</div>
            <p>Then refresh this page.</p>
          </div>
        </body>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});