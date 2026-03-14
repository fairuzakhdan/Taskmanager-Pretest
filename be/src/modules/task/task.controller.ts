import { Request, Response } from 'express';
import { AuthRequest } from '../../shared/middleware/auth.middleware';
import { prisma } from '../../config/database';

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, completed = false } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        completed,
        userId: req.userId!
      }
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Error in createTask:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({ include: { user: { select: { id: true, name: true, email: true } } } });
    res.json(tasks);
  } catch (error) {
    console.error('Error in getAllTasks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMyTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({ where: { userId: req.userId } });
    res.json(tasks);
  } catch (error) {
    console.error('Error in getMyTasks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const task = await prisma.task.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true } } }
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error in getTaskById:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const { title, description, completed } = req.body;

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.userId !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { title, description, completed }
    });

    res.json(updatedTask);
  } catch (error) {
    console.error('Error in updateTask:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.userId !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await prisma.task.delete({ where: { id } });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error in deleteTask:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserTasks = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const tasks = await prisma.task.findMany({ where: { userId: id } });
    res.json(tasks);
  } catch (error) {
    console.error('Error in getUserTasks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
