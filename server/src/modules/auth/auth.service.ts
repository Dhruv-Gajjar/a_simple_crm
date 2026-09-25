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
import { RefreshTokensService } from '../refresh-tokens/refresh-tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private logger: PinoLogger,
    private userService: UserService,
    private jwtService: AuthJwtService,
    private refreshTokenService: RefreshTokensService,
  ) {}

  async signup(input: SignupDto): Promise<AuthResponseDto> {
    const passwordHash = await this.jwtService.hash(input.passwordHash);
    input.passwordHash = passwordHash;

    const newUser = await this.userService.createUser(input);

    const payload = { sub: newUser.id, username: newUser.username };
    const { accessToken, refreshToken } =
      this.jwtService.generateTokens(payload);

    await this.refreshTokenService.createSession({
      userId: newUser.id,
      rawToken: refreshToken,
    });

    return new AuthResponseDto({
      accessToken,
      refreshToken,
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
    const payload = { sub: user.id, username: user.username };

    const { accessToken, refreshToken } =
      this.jwtService.generateTokens(payload);

    await this.refreshTokenService.createSession({
      userId: user.id,
      rawToken: refreshToken,
    });

    return new AuthResponseDto({
      accessToken,
      refreshToken,
      user,
    });
  }

  async refreshToken(rawToken: string) {
    const payload = this.jwtService.verifyRefreshToken(rawToken);

    await this.refreshTokenService.validateAndRotate(payload.sub, rawToken);
    const tokens = this.jwtService.generateTokens({
      sub: payload.sub,
      username: payload.username,
    });

    await this.refreshTokenService.createSession({
      rawToken: tokens.refreshToken,
      userId: payload.sub,
    });
    return tokens;
  }

  async logout(rawToken?: string, userId?: string) {
    if (userId) {
      await this.refreshTokenService.revokeUserSessions(userId);
    }
  }
}
