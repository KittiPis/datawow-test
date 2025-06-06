import { Controller, Post, Body, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body('username') username: string) {
    const user = await this.authService.validateUser(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
