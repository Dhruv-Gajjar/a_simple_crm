import {
  BadRequestException,
  Body,
  Controller,
  Get,
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
import { UserDto } from '../user/dtos/user.dto';
import { Public } from 'src/common/decorators/public.decorator';

interface RequestWithCookies extends Request {
  cookies: Record<string, string | undefined>;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Public()
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
    const data = await this.authService.signup(res, input);
    return data;
  }

  @Public()
  @Post('sign-in')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Signin sucessfull',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to signin',
  })
  async signin(
    @Res({ passthrough: true }) res: Response,
    @Body() input: SigninDto,
  ): Promise<AuthResponseDto> {
    const user = await this.authService.signin(res, input);
    return user;
  }

  @Get('me')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error finding user.',
  })
  async me(@Req() req: Request): Promise<UserDto> {
    const token: unknown = req?.cookies['access_token'] ?? null;
    const currentUser = await this.authService.me(token);
    return currentUser;
  }

  @Public()
  @Post('refresh')
  async refreshToken(
    @Req() req: RequestWithCookies,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const rawRefreshToken = req.cookies?.['refresh_token'];
    if (!rawRefreshToken) {
      throw new UnauthorizedException('Refresh token missing.');
    }
    const { accessToken } = await this.authService.refreshToken(
      res,
      rawRefreshToken,
    );

    return {
      accessToken,
    };
  }

  @Public()
  @Post('logout')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sucessfully logged out.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to logout.',
  })
  logout(@Res({ passthrough: true }) res: Response): string {
    const isLogout = this.authService.logout(res);
    if (!isLogout) {
      throw new BadRequestException('Failed to logout');
    }

    return 'Logout sucessfull';
  }
}
