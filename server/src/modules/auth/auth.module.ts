import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthJwtModule } from '../jwt/jwt.module';
import { JwtStrategy } from './jwt.strategy';
import { RefreshTokensModule } from '../refresh-tokens/refresh-tokens.module';

@Module({
  imports: [UserModule, AuthJwtModule, RefreshTokensModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
