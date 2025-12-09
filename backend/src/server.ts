import express from 'express';
import cors from 'cors';
import issuesRouter from './routes/issues';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'], // Vite ports
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/issues', issuesRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'GitGenie AI Backend is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

