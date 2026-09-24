import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class AuthJwtService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  sign(payload: any): string {
    const access_token = this.jwtService.sign(payload);
    return access_token;
  }

  async hash(password: string): Promise<string> {
    try {
      const passwordHash = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 19456,
        timeCost: parseInt(this.configService.getOrThrow('SALT_ROUNDES')),
        parallelism: 1,
      });

      return passwordHash;
    } catch {
      throw new Error('Failed to hash.');
    }
  }

  async verifyHash(hash: string, password: string): Promise<boolean> {
    try {
      const isVerified = await argon2.verify(hash, password);
      if (!isVerified) {
        return false;
      }

      return isVerified;
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
