import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse } from '@nestjs/swagger';
import { AuthResponseDto } from './dtos/auth-response.dto';
import { SigninDto } from './dtos/signin.dto';
import { SignupDto } from './dtos/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Signin sucessfull',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to signin',
  })
  async signup(@Body() input: SignupDto): Promise<AuthResponseDto> {
    const user = await this.authService.signup(input);
    return user;
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
}
