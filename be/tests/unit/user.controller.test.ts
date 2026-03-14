import '../setup';
import { Request, Response } from 'express';
import { register, login } from '../../src/modules/user/user.controller';
import { mockPrisma } from '../setup';
import bcrypt from 'bcrypt';
import * as jwtUtil from '../../src/utils/jwt.util';

jest.mock('bcrypt');
jest.mock('../../src/utils/jwt.util');

describe('User Controller', () => {
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

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockPrisma.user.create.mockResolvedValue(mockUser);

      await register(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User registered successfully',
      });
    });

    it('should return 400 if email already exists', async () => {
      mockRequest.body = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User',
      };

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'existing@example.com',
        password: 'hashedPassword',
        name: 'Existing User',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await register(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Email already exists',
      });
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwtUtil.generateToken as jest.Mock).mockReturnValue('mock-token');

      await login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          token: 'mock-token',
          user: expect.objectContaining({
            email: 'test@example.com',
            name: 'Test User',
          }),
        })
      );
    });

    it('should return 401 for invalid credentials', async () => {
      mockRequest.body = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);

      await login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid credentials',
      });
    });
  });
});
