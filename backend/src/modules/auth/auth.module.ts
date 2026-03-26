import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AuthCredentialRepository } from './repositories/auth-credential.repository';
import { AuthSessionRepository } from './repositories/auth-session.repository';
import { PasswordResetRepository } from './repositories/password-reset.repository';
import { TokenFactory } from './factories/token.factory';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '15m') as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthCredentialRepository,
    AuthSessionRepository,
    PasswordResetRepository,
    TokenFactory,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
