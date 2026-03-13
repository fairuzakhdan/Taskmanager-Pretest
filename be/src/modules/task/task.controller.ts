import { Request, Response } from 'express';
import { AuthRequest } from '../../shared/middleware/auth.middleware';
import { prisma } from '../../config/database';

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, status, completed } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Convert checkbox boolean to status string
    let taskStatus = status || 'pending';
    if (completed !== undefined) {
      taskStatus = completed ? 'completed' : 'pending';
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: taskStatus,
        userId: req.userId!
      }
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({ include: { user: { select: { id: true, name: true, email: true } } } });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({ where: { userId: req.userId } });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
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
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const { title, description, status, completed } = req.body;

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.userId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to update this task' });
    }

    // Convert checkbox boolean to status string
    let taskStatus = status;
    if (completed !== undefined) {
      taskStatus = completed ? 'completed' : 'pending';
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { title, description, status: taskStatus }
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.userId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this task' });
    }

    await prisma.task.delete({ where: { id } });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserTasks = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const tasks = await prisma.task.findMany({ where: { userId: id } });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
