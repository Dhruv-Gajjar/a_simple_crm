import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthJwtModule } from '../jwt/jwt.module';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { MailPreviewController } from '../app-mail/mail-preview.controller';
import { WelcomeUserMail } from '../app-mail/welcome-user.mail';
import { AppMailModule } from '../app-mail/app-mail.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
    AuthJwtModule,
    AppMailModule,
  ],
  controllers:
    process.env.NODE_ENV === 'production'
      ? [AuthController]
      : [AuthController, MailPreviewController],
  providers: [AuthService, JwtStrategy, WelcomeUserMail],
  exports: [AuthService],
})
export class AuthModule {}
