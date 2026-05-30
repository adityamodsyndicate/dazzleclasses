import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Serve Static Frontend Assets (Vite Production Build)
const frontendDistPath = path.join(__dirname, '../dist');
app.use(express.static(frontendDistPath));

// Fallback Route to index.html for Single-Page Application (SPA) routing
app.get('*', (req, res) => {
  // If request is looking for API and got here, return 404
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ message: 'An internal server error occurred.' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`⚡ Dazzle Academy Backend listening on port ${PORT}`);
  console.log(`🚀 API base URL: http://localhost:${PORT}/api`);
  console.log(`====================================================`);
});
