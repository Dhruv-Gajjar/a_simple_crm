import { Mailable } from '@nestjs/mail';
import { UserDto } from '../user/dtos/user.dto';

export interface WelcomeUserType {
  user: UserDto;
  testUrl: string;
}

const TEST_URL = 'http://localhost:5000/api/';

export class WelcomeUserMail implements Mailable<WelcomeUserType> {
  render({ user }: WelcomeUserType) {
    return {
      subject: 'Welcome email',
      template: 'welcome',
      context: {
        user,
        testUrl: TEST_URL,
      },
    };
  }
}
