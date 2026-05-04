import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Growthory API is running');
});

if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log('\n🚀 Growthory Intelligence Protocol Active');
    console.log(`📡 Backend Node:    http://localhost:${PORT}`);
    console.log(`🌐 Ecosystem Sync:  http://localhost:${PORT}/api/status\n`);
  });
}

export default app;
