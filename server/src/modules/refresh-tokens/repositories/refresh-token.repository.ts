import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { RefreshTokenEntity } from 'src/modules/refresh-tokens/entities/refresh-token.entity';
import { DataSource } from 'typeorm';

type Payload = {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  ttlDays?: number;
};

@Injectable()
export class RefreshTokenRepository extends BaseRepository<RefreshTokenEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, RefreshTokenEntity);
  }

  async createAndSave(payload: Payload): Promise<RefreshTokenEntity> {
    const token = this.repository.create(payload);
    return await this.repository.save(token);
  }

  async findTokensByUserId(userId: string): Promise<RefreshTokenEntity[]> {
    const tokens = await this.repository.find({
      where: {
        userId,
      },
    });

    return tokens;
  }

  async revokeToken(id: string): Promise<void> {
    await this.repository.update(id, { isRevoked: true });
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.repository.update(
      { userId, isRevoked: false },
      { isRevoked: true },
    );
  }
}
