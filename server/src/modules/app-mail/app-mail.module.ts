import { Module } from '@nestjs/common';
import { AppMailService } from './app-mail.service';
import { AppMailController } from './app-mail.controller';
import {
  FileTemplateEngine,
  MailModule,
  MailModuleOptions,
} from '@nestjs/mail';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'node:path';
import { mailTransport } from './mail-transport';
import { WelcomeUserMail } from './welcome-user.mail';

@Module({
  imports: [
    MailModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const mailModule: MailModuleOptions = {
          transport: mailTransport(),
          templates: new FileTemplateEngine({
            dir: join(__dirname, '../../common/mail/templates'),
            layout: 'layout',
            cache: process.env.NODE_ENV === 'production',
          }),
          from: configService.getOrThrow<string>('MAIL_FROM'),
        };
        return mailModule;
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppMailController],
  providers: [AppMailService, WelcomeUserMail],
  exports: [AppMailService],
})
export class AppMailModule {}
