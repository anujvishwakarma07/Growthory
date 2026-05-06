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

app.use(connectDB);
const allowedOrigins = [
  'https://growthory.vercel.app',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
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
