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

const app = express();

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors({ origin: process.env.ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(morgan('dev'));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello to the bug tracker API');
});

app.use('/users', userRouter);
app.use('/projects', projectRouter);
app.use('/tickets', ticketRouter);

const PORT = process.env.PORT || 8080;
const CONNECTION_URI = process.env.MONGO_URI || '';

mongoose.set('strictQuery', false);
mongoose.connect(CONNECTION_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    })
  }).catch((err) => {
    console.log(`Connection error: ${err}`);
  });

