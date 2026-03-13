import jwt from 'jsonwebtoken';

export const generateToken = (userId: number): string => {
  const secret = process.env.JWT_SECRET || 'default-secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ userId }, secret, { expiresIn } as any);
};

export const verifyToken = (token: string): { userId: number } => {
  const secret = process.env.JWT_SECRET || 'default-secret';
  return jwt.verify(token, secret) as { userId: number };
};
