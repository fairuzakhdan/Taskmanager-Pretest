import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../../config/database';
import { generateToken } from '../../utils/jwt.util';
import { AuthRequest } from '../../shared/middleware/auth.middleware';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name }
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    const { password: _, ...userWithoutPassword } = user;

    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({ 
      select: { id: true, email: true, name: true, createdAt: true, updatedAt: true } 
    });
    res.json(users);
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    
    // User hanya bisa lihat profile sendiri
    if (req.userId !== id) {
      return res.status(403).json({ message: 'Can only view your own profile' });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, createdAt: true, updatedAt: true }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error in getUserById:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const { email, name, password } = req.body;

    // User hanya bisa update dirinya sendiri
    if (req.userId !== id) {
      return res.status(403).json({ message: 'Can only update your own profile' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email already used by another user
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const data: any = {};
    if (email) data.email = email;
    if (name) data.name = name;
    if (password) data.password = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, createdAt: true, updatedAt: true }
    });

    res.json(user);
  } catch (error) {
    console.error('Error in updateUser:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    
    // User hanya bisa delete dirinya sendiri
    if (req.userId !== id) {
      return res.status(403).json({ message: 'Can only delete your own account' });
    }

    // Check if user exists
    const userToDelete = await prisma.user.findUnique({ where: { id } });
    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }

    await prisma.user.delete({ where: { id } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
