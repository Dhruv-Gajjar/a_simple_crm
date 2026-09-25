import { Module } from '@nestjs/common';
import { RefreshTokensService } from './refresh-tokens.service';
import { RefreshTokensController } from './refresh-tokens.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { RefreshTokenEntity } from './entities/refresh-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshTokenEntity])],
  controllers: [RefreshTokensController],
  providers: [RefreshTokensService, RefreshTokenRepository],
  exports: [RefreshTokensService],
})
export class RefreshTokensModule {}
