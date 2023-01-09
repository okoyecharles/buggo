import { NextFunction, Response } from 'express';
import AuthorizedRequest from '../types/request';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || '';
const protect = async (
  req: AuthorizedRequest<any>,
  res: Response,
  next: NextFunction
) => {
  const requestToken = req.headers.authorization;
  let token = '';

  if (requestToken && requestToken.startsWith('Bearer')) {
    try {
      token = requestToken.split(' ')[1];

      const decoded: any = jwt.verify(token, secret);

      req.user = decoded.id;

      next();
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized' });
    }
  }

  if (!token) {
    res.status(400).json({ message: 'Not authorized, no token' });
  }
};

export default protect;
