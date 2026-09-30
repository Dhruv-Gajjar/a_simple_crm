import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { SigninDto } from './dtos/signin.dto';
import { AuthJwtService } from '../jwt/jwt.service';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { SignupDto } from './dtos/signup.dto';
import { UserDto } from '../user/dtos/user.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private jwtService: AuthJwtService,
  ) {}

  async signup(res: Response, input: SignupDto): Promise<AuthResponseDto> {
    const passwordHash = await this.jwtService.hash(input.passwordHash);
    input.passwordHash = passwordHash;

    const newUser = await this.userService.createUser(input);

    const payload = { sub: newUser.id, username: newUser.username };
    const { accessToken, refreshToken } =
      await this.jwtService.generateTokens(payload);

    const isProduction: boolean =
      this.configService.getOrThrow<string>('NODE_ENV') === 'production';

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: this.configService.getOrThrow('JWT_EXPIRES_IN'),
      path: '/',
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: this.configService.getOrThrow('JWT_REFRESH_EXPIRES_IN'),
      path: '/auth/refresh',
    });

    return new AuthResponseDto({
      accessToken,
      user: newUser,
    });
  }

  async signin(res: Response, input: SigninDto): Promise<AuthResponseDto> {
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
      await this.jwtService.generateTokens(payload);

    const isProduction: boolean =
      this.configService.getOrThrow<string>('NODE_ENV') === 'production';

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    });

    return new AuthResponseDto({
      accessToken,
      user,
    });
  }

  async me(token: unknown): Promise<UserDto> {
    if (!token) {
      throw new UnauthorizedException('Invalid token or user.');
    }
    const t = token as string;
    const rawToken = this.jwtService.verify(t);

    if (!rawToken) {
      throw new UnauthorizedException();
    }

    const currentUser = await this.userService.findUserById(rawToken.sub);

    return currentUser;
  }

  async refreshToken(rawToken: string): Promise<{ accessToken: string }> {
    const payload = this.jwtService.verifyRefreshToken(rawToken);

    const accessToken = await this.jwtService.signAsync({
      sub: payload.sub,
      username: payload.username,
    });

    return { accessToken };
  }

  logout(res: Response): boolean {
    const isProduction: boolean =
      this.configService.getOrThrow<string>('NODE_ENV') === 'production';

    res.clearCookie('access_token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    });

    return true;
  }
}
