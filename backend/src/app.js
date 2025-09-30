import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import interviewRoutes from './routes/interview.routes.js';
import interviewerRoutes from './routes/interviewer.routes.js';
import userRoutes from './routes/user.routes.js'; // existing user routes

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', interviewRoutes);
app.use('/api/interviewer', interviewerRoutes);


// Simple health check route
app.get('/', (req, res) => {
  res.send('🚀 AI Interview Assistant Backend is running!');
});

export default app;
