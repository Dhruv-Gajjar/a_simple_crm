import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse } from '@nestjs/swagger';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { SigninDto } from './dtos/signin.dto';
import { SignupDto } from './dtos/signup.dto';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

interface RequestWithCookies extends Request {
  cookies: Record<string, string | undefined>;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('sign-up')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Signin sucessfull',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to signin',
  })
  async signup(
    @Body() input: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const data = await this.authService.signup(input);
    console.log({ data });
    const isProduction: boolean =
      this.configService.getOrThrow<string>('NODE_ENV') === 'production';

    res.cookie('access_token', data.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    res.cookie('refresh_token', data.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return data;
  }

  @Post('sign-in')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Signin sucessfull',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to signin',
  })
  async signin(@Body() input: SigninDto): Promise<AuthResponseDto> {
    const user = await this.authService.signin(input);
    return user;
  }

  @Post('refresh')
  async refreshToken(
    @Req() req: RequestWithCookies,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const rawRefreshToken = req.cookies?.['refresh_token'];
    console.log('cookies', req.cookies);
    if (!rawRefreshToken) {
      throw new UnauthorizedException('Refresh token missing.');
    }
    const { accessToken, refreshToken } =
      await this.authService.refreshToken(rawRefreshToken);

    const isProduction = process.env.NODE_ENV === 'production';

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

    return {
      accessToken,
      refreshToken,
    };
  }
}
