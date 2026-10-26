import { Controller, Get, Header } from '@nestjs/common';
import { Mailer } from '@nestjs/mail';
import { WelcomeUserMail } from './welcome-user.mail';
import { UserDto } from '../user/dtos/user.dto';

@Controller('dev/mail')
export class MailPreviewController {
  constructor(private readonly mailer: Mailer) {}

  @Get(`welcome-mail`)
  @Header('content-type', 'text/html; charset=utf-8')
  async welcomeEmail() {
    const message = await this.mailer.render(WelcomeUserMail, {
      data: {
        user: new UserDto({
          id: 'lasd-aksdhfkhs-kashfdk-asdf',
          username: 'Test User',
          email: 'testuesr@emai.com',
          firstName: 'Test',
          lastName: 'User',
        }),
        testUrl: 'http://localhost:5000/api/',
      },
    });

    let body = message.html ?? '';
    for (const { cid, contentType, content } of message.attachments) {
      if (cid) {
        body = body.replaceAll(
          `cid:${cid}`,
          `data:${contentType};base64,${content.toString('base64')}`,
        );
      }
    }
    return body;
  }
}
