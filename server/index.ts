import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import userRouter from './routes/userRoutes';
import projectRouter from './routes/projectRoutes';
import ticketRouter from './routes/ticketRoutes';
import connectToPusher from './config/Pusher';
import colors from '@colors/colors/safe';

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

mongoose.set('strictQuery', false);
mongoose.connect(CONNECTION_URI)
  .then((conn) => {
    app.listen(PORT, () => {
      console.log(`Connected to ${conn.connection.name} successfully...`);
      console.log('Host:', colors.cyan(conn.connection.host));
      console.log('Port:', colors.cyan(PORT.toString()));
    })
  }).catch((err) => {
    console.log('\nError connecting to MongoDB...');
    console.log('Message:', colors.red(err.message || err), '\n');
  });

export { pusher, pusherChannel };