import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { register, login, getUsers, updateUser, deleteUser } from '../../src/controllers/user.controller';
import User from '../../src/models/user.model';
import { env } from '../../src/config/env';

jest.mock('../../src/models/user.model');
jest.mock('jsonwebtoken');
jest.mock('../../src/config/env', () => ({
  env: {
    JWT_SECRET: 'test-secret'
  }
}));

const mockUser = User as jest.Mocked<typeof User>;
const mockJwt = jwt as jest.Mocked<typeof jwt>;

describe('User Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('register', () => {
    beforeEach(() => {
      mockReq.body = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };
    });

    it('should return error if email already exists', async () => {
      mockUser.findOne.mockResolvedValue({ email: 'test@example.com' } as any);

      await register(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Email already registered' });
    });

    it('should handle server errors', async () => {
      mockUser.findOne.mockRejectedValue(new Error('Database error'));

      await register(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Server error' });
    });
  });

  describe('login', () => {
    beforeEach(() => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'password123'
      };
    });

    it('should login user successfully', async () => {
      const mockUserDoc = {
        _id: 'user-id',
        email: 'test@example.com',
        comparePassword: jest.fn().mockResolvedValue(true)
      };

      mockUser.findOne.mockResolvedValue(mockUserDoc as any);
      mockJwt.sign
        .mockReturnValueOnce('access-token' as any)
        .mockReturnValueOnce('refresh-token' as any);

      await login(mockReq as Request, mockRes as Response);

      expect(mockUser.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mockUserDoc.comparePassword).toHaveBeenCalledWith('password123');
      expect(mockRes.json).toHaveBeenCalledWith({
        accessToken: 'access-token',
        refreshToken: 'refresh-token'
      });
    });

    it('should return error for invalid credentials', async () => {
      mockUser.findOne.mockResolvedValue(null);

      await login(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should return error for wrong password', async () => {
      const mockUserDoc = {
        _id: 'user-id',
        email: 'test@example.com',
        comparePassword: jest.fn().mockResolvedValue(false)
      };

      mockUser.findOne.mockResolvedValue(mockUserDoc as any);

      await login(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should handle server errors', async () => {
      mockUser.findOne.mockRejectedValue(new Error('Database error'));

      await login(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Server error' });
    });
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { _id: '1', username: 'user1', email: 'user1@test.com' },
        { _id: '2', username: 'user2', email: 'user2@test.com' }
      ];

      const mockQuery = {
        select: jest.fn().mockResolvedValue(mockUsers)
      };
      mockUser.find.mockReturnValue(mockQuery as any);

      await getUsers(mockReq as Request, mockRes as Response);

      expect(mockUser.find).toHaveBeenCalled();
      expect(mockQuery.select).toHaveBeenCalledWith('-password');
      expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should return error when no users found', async () => {
      const mockQuery = {
        select: jest.fn().mockResolvedValue([])
      };
      mockUser.find.mockReturnValue(mockQuery as any);

      await getUsers(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'No users found' });
    });

    it('should handle server errors', async () => {
      const mockQuery = {
        select: jest.fn().mockRejectedValue(new Error('Database error'))
      };
      mockUser.find.mockReturnValue(mockQuery as any);

      await getUsers(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Server error' });
    });
  });

  describe('updateUser', () => {
    beforeEach(() => {
      mockReq.params = { id: 'user-id' };
      mockReq.body = { username: 'updateduser' };
    });

    it('should update user successfully', async () => {
      const mockUpdatedUser = {
        _id: 'user-id',
        username: 'updateduser',
        email: 'test@example.com'
      };

      const mockQuery = {
        select: jest.fn().mockResolvedValue(mockUpdatedUser)
      };
      mockUser.findByIdAndUpdate.mockReturnValue(mockQuery as any);

      await updateUser(mockReq as Request, mockRes as Response);

      expect(mockUser.findByIdAndUpdate).toHaveBeenCalledWith(
        'user-id',
        { username: 'updateduser' },
        { new: true }
      );
      expect(mockQuery.select).toHaveBeenCalledWith('-password');
      expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedUser);
    });

    it('should return error when user not found', async () => {
      const mockQuery = {
        select: jest.fn().mockResolvedValue(null)
      };
      mockUser.findByIdAndUpdate.mockReturnValue(mockQuery as any);

      await updateUser(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should handle server errors', async () => {
      const mockQuery = {
        select: jest.fn().mockRejectedValue(new Error('Database error'))
      };
      mockUser.findByIdAndUpdate.mockReturnValue(mockQuery as any);

      await updateUser(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Server error' });
    });
  });

  describe('deleteUser', () => {
    beforeEach(() => {
      mockReq.params = { id: 'user-id' };
    });

    it('should delete user successfully', async () => {
      const mockDeletedUser = { _id: 'user-id', username: 'testuser' };
      mockUser.findByIdAndDelete.mockResolvedValue(mockDeletedUser as any);

      await deleteUser(mockReq as Request, mockRes as Response);

      expect(mockUser.findByIdAndDelete).toHaveBeenCalledWith('user-id');
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('should return error when user not found', async () => {
      mockUser.findByIdAndDelete.mockResolvedValue(null);

      await deleteUser(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should handle server errors', async () => {
      mockUser.findByIdAndDelete.mockRejectedValue(new Error('Database error'));

      await deleteUser(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Server error' });
    });
  });
});
