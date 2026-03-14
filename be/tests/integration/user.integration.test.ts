import '../setup';
import request from 'supertest';
import express from 'express';
import userRoutes from '../../src/modules/user/user.routes';
import { mockPrisma } from '../setup';
import bcrypt from 'bcrypt';
import * as jwtUtil from '../../src/utils/jwt.util';

jest.mock('bcrypt');
jest.mock('../../src/utils/jwt.util');

const app = express();
app.use(express.json());
app.use('/api', userRoutes);

describe('User API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/users (Register)', () => {
    it('should register a new user', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockPrisma.user.create.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/users')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User registered successfully');
    });
  });

  describe('POST /api/users/login', () => {
    it('should login user and return token', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwtUtil.generateToken as jest.Mock).mockReturnValue('mock-jwt-token');

      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token', 'mock-jwt-token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).not.toHaveProperty('password');
    });
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const mockUsers = [
        {
          id: 1,
          email: 'user1@example.com',
          name: 'User 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.user.findMany.mockResolvedValue(mockUsers);

      const response = await request(app).get('/api/users');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('email', 'user1@example.com');
    });
  });
});
