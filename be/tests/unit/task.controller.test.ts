import '../setup';
import { Request, Response } from 'express';
import { createTask, getAllTasks } from '../../src/modules/task/task.controller';
import { mockPrisma } from '../setup';
import { AuthRequest } from '../../src/shared/middleware/auth.middleware';

describe('Task Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    mockRequest = {};
    responseObject = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockResponse = responseObject;
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a new task successfully', async () => {
      const mockTask = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.body = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
      };
      (mockRequest as AuthRequest).userId = 1;

      mockPrisma.task.create.mockResolvedValue(mockTask);

      await createTask(mockRequest as AuthRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTask);
    });

    it('should return 400 if title is missing', async () => {
      mockRequest.body = { description: 'Test Description' };
      (mockRequest as AuthRequest).userId = 1;

      await createTask(mockRequest as AuthRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Title is required',
      });
    });
  });

  describe('getAllTasks', () => {
    it('should return all tasks with user information', async () => {
      const mockTasks = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Description 1',
          status: 'pending',
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: { id: 1, name: 'User 1', email: 'user1@example.com' },
        },
      ];

      mockPrisma.task.findMany.mockResolvedValue(mockTasks);

      await getAllTasks(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith(mockTasks);
    });
  });
});
