import { NextFunction, Response } from "express";
import AuthorizedRequest from '../types/request';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || '';
const protect = (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  const requestToken = req.headers.authorization;

  if (requestToken && requestToken.startsWith('Bearer')) {
    const token = requestToken.split(' ')[1];
    jwt.verify(token, secret, (err, user: any) => {
      if (err) {
        res.status(401).json({ message: 'Not authorized, token failed' });
      } else {
        req.user = user?.id;
        next();
      }
    });
  }

  res.status(401).json({ message: 'Not authorized, no token' });
};

export default protect;