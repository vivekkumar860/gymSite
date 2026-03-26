import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: jest.Mocked<AuthService>;

  const mockAuthResponse = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    user: {
      id: 'user-1',
      username: 'testuser',
      email: 'test@example.com',
      role: 'MEMBER',
    },
  };

  const mockCurrentUser = {
    id: 'user-1',
    username: 'testuser',
    email: 'test@example.com',
    role: 'MEMBER',
    accountStatus: 'ACTIVE',
    createdAt: '2025-01-01T00:00:00.000Z',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            getCurrentUser: jest.fn(),
            requestPasswordReset: jest.fn(),
            resetPassword: jest.fn(),
            refreshTokens: jest.fn(),
            logout: jest.fn(),
            logoutAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(AuthController);
    service = module.get(AuthService);
  });

  describe('register', () => {
    it('should delegate to service', async () => {
      service.register.mockResolvedValue(mockAuthResponse);

      const result = await controller.register({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password1',
      });

      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe('login', () => {
    it('should delegate to service', async () => {
      service.login.mockResolvedValue(mockAuthResponse);

      const result = await controller.login({
        email: 'test@example.com',
        password: 'Password1',
      });

      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe('getMe', () => {
    it('should return current user profile', async () => {
      service.getCurrentUser.mockResolvedValue(mockCurrentUser);

      const result = await controller.getMe('user-1');

      expect(result).toEqual(mockCurrentUser);
      expect(service.getCurrentUser).toHaveBeenCalledWith('user-1');
    });
  });

  describe('forgotPassword', () => {
    it('should return generic message regardless of email existence', async () => {
      service.requestPasswordReset.mockResolvedValue(undefined);

      const result = await controller.forgotPassword({
        email: 'any@example.com',
      });

      expect(result.message).toContain('If that email is registered');
    });
  });

  describe('resetPassword', () => {
    it('should delegate to service and return success message', async () => {
      service.resetPassword.mockResolvedValue(undefined);

      const result = await controller.resetPassword({
        token: 'some-token',
        newPassword: 'NewPassword1',
      });

      expect(result.message).toContain('reset successfully');
    });
  });

  describe('refresh', () => {
    it('should delegate to service', async () => {
      service.refreshTokens.mockResolvedValue(mockAuthResponse);

      const result = await controller.refresh({
        refreshToken: 'refresh-token',
      });

      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe('logout', () => {
    it('should delegate to service', async () => {
      await controller.logout({ refreshToken: 'refresh-token' });

      expect(service.logout).toHaveBeenCalledWith('refresh-token');
    });
  });

  describe('logoutAll', () => {
    it('should delegate to service', async () => {
      await controller.logoutAll('user-1');

      expect(service.logoutAll).toHaveBeenCalledWith('user-1');
    });
  });
});
