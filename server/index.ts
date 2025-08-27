import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import colors from '@colors/colors/safe';

import userRouter from './routes/userRoutes';
import projectRouter from './routes/projectRoutes';
import ticketRouter from './routes/ticketRoutes';
import connectToPusher from './config/Pusher';
import { VercelRequest, VercelResponse } from '@vercel/node';

const app = express();
const pusher = connectToPusher();
const pusherChannel = 'bug-tracker';

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors({ origin: process.env.ORIGIN!, credentials: true }));
app.use(morgan('dev'));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Welcome to the Bug Tracker API!');
});

app.use('/api/users', userRouter);
app.use('/api/projects', projectRouter);
app.use('/api/tickets', ticketRouter);

const PORT = +process.env.PORT!;
const CONNECTION_URI = process.env.MONGO_URI || '';

// ---
let cachedDb: typeof mongoose | null = null;

async function connectDB() {
  if (cachedDb) return cachedDb;

  mongoose.set("strictQuery", false);
  const conn = await mongoose.connect(CONNECTION_URI);

  console.log(colors.green(`Connected to ${conn.connection.name}`));
  cachedDb = conn;
  return conn;
}

// 🔑 Handler for Vercel
const handler = async (req: VercelRequest, res: VercelResponse) => {
  try {
    await connectDB(); // ensure DB connected
    app(req as any, res as any); // pass request into Express
  } catch (err: any) {
    console.error("MongoDB connection error:", err);
    res.status(500).send("Database connection error");
  }
};
// ---

export default handler;
export { pusher, pusherChannel };
