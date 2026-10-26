import { Injectable } from '@nestjs/common';
import { Mailer } from '@nestjs/mail';
import { UserDto } from '../user/dtos/user.dto';
import { WelcomeUserMail } from './welcome-user.mail';

@Injectable()
export class AppMailService {
  constructor(private readonly mailer: Mailer) {}

  async sendEmail(user: UserDto) {
    await this.mailer.send(WelcomeUserMail, {
      to: {
        name: user.username,
        address: user.email,
      },
      data: {
        user: user,
        testUrl: 'http://localhost:5000/',
      },
    });
  }
}
