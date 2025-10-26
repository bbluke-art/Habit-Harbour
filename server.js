// server.js
const express = require('express');
const path = require('path');

const app = express();

// Serve all static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Optional: handle unknown routes by redirecting to index.html
// Useful if you want a fallback for the dashboard route or SPA-like behavior
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Listen on the port Render assigns, or fallback to 3000 locally
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`HabitHarbor server running on port ${port}`);
});
