import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { UserService } from '../user/user.service';
import { SigninDto } from './dtos/signin.dto';
import { AuthJwtService } from '../jwt/jwt.service';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { SignupDto } from './dtos/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private logger: PinoLogger,
    private userService: UserService,
    private jwtService: AuthJwtService,
  ) {}

  async signup(input: SignupDto): Promise<AuthResponseDto> {
    const passwordHash = await this.jwtService.hash(input.passwordHash);
    input.passwordHash = passwordHash;

    const newUser = await this.userService.createUser(input);

    const payload = { username: input.username, userId: newUser.id };
    const accessToken = this.jwtService.sign(payload);

    return new AuthResponseDto({
      accessToken,
      user: newUser,
    });
  }

  async signin(input: SigninDto): Promise<AuthResponseDto> {
    const user = await this.userService.findUserByUsername(input.username);

    if (!user) {
      throw new NotFoundException(
        `User with username: ${input.username} not found.`,
      );
    }

    const isPasswordMatch = await this.jwtService.verifyHash(
      user.passwordHash,
      input.passwordHash,
    );

    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid username or password, Try again.');
    }
    const payload = { userId: user.id, username: user.username };
    const accessToken = this.jwtService.sign(payload);

    return new AuthResponseDto({
      accessToken,
      user,
    });
  }
}
