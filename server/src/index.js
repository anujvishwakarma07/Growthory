import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import connectDB from './config/db.js';

if (typeof global.DOMMatrix === 'undefined') {
    global.DOMMatrix = class DOMMatrix {};
}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS MUST come FIRST — before DB middleware, before routes, before everything.
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Explicitly handle all OPTIONS preflight requests immediately
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.status(200).end();
});

app.use(express.json());

// DB connect comes AFTER cors so preflight never gets blocked
app.use(connectDB);

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
