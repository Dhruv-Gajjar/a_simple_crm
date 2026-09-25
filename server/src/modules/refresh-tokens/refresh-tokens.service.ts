import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { CreateRefresTokenDto } from './dtos/create-refresh-token.dto';
import { RefreshTokenEntity } from './entities/refresh-token.entity';

@Injectable()
export class RefreshTokensService {
  constructor(private refreshTokenRepository: RefreshTokenRepository) {}

  async createSession(payload: CreateRefresTokenDto): Promise<RefreshTokenDto> {
    const tokenHash = await argon2.hash(payload.rawToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const newToken = await this.refreshTokenRepository.createAndSave({
      userId: payload.userId,
      tokenHash,
      expiresAt,
    });

    return new RefreshTokenDto({
      id: newToken.id,
      userId: newToken.userId,
      tokenHash,
      expiresAt,
    });
  }

  async validateAndRotate(
    userId: string,
    incomingToken: string,
  ): Promise<RefreshTokenDto> {
    const activeTokens =
      await this.refreshTokenRepository.findTokensByUserId(userId);

    let matchedToken: RefreshTokenEntity | null = null;

    for (const record of activeTokens) {
      const isMatch = await argon2.verify(record.tokenHash, incomingToken);
      if (isMatch) {
        matchedToken = record;
        break;
      }
    }

    if (!matchedToken || matchedToken.expiresAt <= new Date()) {
      throw new UnauthorizedException(`Refresh token is invalid or expired.`);
    }

    await this.refreshTokenRepository.revokeToken(matchedToken.id);
    return new RefreshTokenDto({
      id: matchedToken.id,
      userId: matchedToken.userId,
      expiresAt: matchedToken.expiresAt,
      tokenHash: matchedToken.tokenHash,
    });
  }

  async revokeUserSessions(userId: string): Promise<void> {
    await this.refreshTokenRepository.revokeAllUserTokens(userId);
  }
}
