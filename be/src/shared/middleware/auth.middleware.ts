import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../utils/jwt.util';

export interface AuthRequest extends Request {
  userId?: number;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    console.log('Auth middleware called, headers:', req.headers.authorization);
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = verifyToken(token);
    console.log('Token decoded, userId:', decoded.userId);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
