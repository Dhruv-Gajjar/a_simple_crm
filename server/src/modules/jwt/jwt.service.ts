import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import type { SignOptions } from 'jsonwebtoken';
import * as argon2 from 'argon2';

export interface JwtAuthPayload {
  sub: string;
  username: string;
  [key: string]: any;
}

export interface GeneratedTokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthJwtService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokens(payload: JwtAuthPayload): Promise<GeneratedTokenPair> {
    const accessToken = await this.jwtService.signAsync(payload);

    const refreshTokenExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
      '7d',
    ) as SignOptions['expiresIn'];

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: refreshTokenExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  async signAsync(
    payload: JwtAuthPayload,
    options?: JwtSignOptions,
  ): Promise<string> {
    return await this.jwtService.signAsync(payload, options);
  }

  verify<T extends object = JwtAuthPayload>(token: string): T {
    try {
      return this.jwtService.verify<T>(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired access token.');
    }
  }

  verifyRefreshToken<T extends object = JwtAuthPayload>(token: string): T {
    try {
      return this.jwtService.verify<T>(token, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }
  }

  async hash(value: string): Promise<string> {
    try {
      return await argon2.hash(value, {
        type: argon2.argon2id,
        memoryCost: 19456,
        timeCost: parseInt(this.configService.getOrThrow('SALT_ROUNDS'), 10),
        parallelism: 1,
      });
    } catch {
      throw new InternalServerErrorException('Failed to hash value.');
    }
  }

  async verifyHash(hash: string, plainText: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plainText);
    } catch {
      throw new InternalServerErrorException('Error verifying hash.');
    }
  }
}
