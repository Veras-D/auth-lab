import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { profile, logout, refreshToken } from '../../src/controllers/auth.controller';
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

describe('Auth Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('profile', () => {
    beforeEach(() => {
      mockReq.user = {
        id: 'user-id',
        email: 'test@example.com',
        username: 'testuser'
      };
    });

    it('should return user profile successfully', async () => {
      const mockUserProfile = {
        _id: 'user-id',
        username: 'testuser',
        email: 'test@example.com'
      };

      const mockQuery = {
        select: jest.fn().mockResolvedValue(mockUserProfile)
      };
      mockUser.findById.mockReturnValue(mockQuery as any);

      await profile(mockReq as Request, mockRes as Response);

      expect(mockUser.findById).toHaveBeenCalledWith('user-id');
      expect(mockQuery.select).toHaveBeenCalledWith('-password');
      expect(mockRes.json).toHaveBeenCalledWith({
        id: 'user-id',
        username: 'testuser',
        email: 'test@example.com'
      });
    });

    it('should return error when user not found', async () => {
      const mockQuery = {
        select: jest.fn().mockResolvedValue(null)
      };
      mockUser.findById.mockReturnValue(mockQuery as any);

      await profile(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should handle server errors', async () => {
      const mockQuery = {
        select: jest.fn().mockRejectedValue(new Error('Database error'))
      };
      mockUser.findById.mockReturnValue(mockQuery as any);

      await profile(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Server error' });
    });

    it('should handle missing user in request', async () => {
      mockReq.user = undefined;

      const mockQuery = {
        select: jest.fn().mockResolvedValue(null)
      };
      mockUser.findById.mockReturnValue(mockQuery as any);

      await profile(mockReq as Request, mockRes as Response);

      expect(mockUser.findById).toHaveBeenCalledWith(undefined);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'User not found' });
    });
  });

  describe('logout', () => {
    it('should logout successfully', () => {
      logout(mockReq as Request, mockRes as Response);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Logged out successfully. Please discard token on client.'
      });
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', () => {
      mockReq.body = { refreshToken: 'valid-refresh-token' };

      const mockDecodedToken = { id: 'user-id' };
      mockJwt.verify.mockReturnValue(mockDecodedToken as any);
      mockJwt.sign.mockReturnValue('new-access-token' as any);

      refreshToken(mockReq as Request, mockRes as Response);

      expect(mockJwt.verify).toHaveBeenCalledWith('valid-refresh-token', 'test-secret');
      expect(mockJwt.sign).toHaveBeenCalledWith(
        { id: 'user-id' },
        'test-secret',
        { expiresIn: '1h' }
      );
      expect(mockRes.json).toHaveBeenCalledWith({
        accessToken: 'new-access-token'
      });
    });

    it('should return error when refresh token is missing', () => {
      mockReq.body = {};

      refreshToken(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Refresh token missing'
      });
    });

    it('should return error for invalid refresh token', () => {
      mockReq.body = { refreshToken: 'invalid-token' };

      mockJwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      refreshToken(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid refresh token'
      });
    });

    it('should handle null refresh token', () => {
      mockReq.body = { refreshToken: null };

      refreshToken(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Refresh token missing'
      });
    });

    it('should handle undefined refresh token', () => {
      mockReq.body = { refreshToken: undefined };

      refreshToken(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Refresh token missing'
      });
    });
  });
});
