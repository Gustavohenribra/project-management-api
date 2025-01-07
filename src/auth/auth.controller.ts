import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface LoginDTO {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDTO): Promise<any> {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: LoginDTO): Promise<{ access_token: string }> {
    return this.authService.login(body);
  }
}