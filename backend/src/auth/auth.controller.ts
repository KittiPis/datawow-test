/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Controller,
  Post,
  Body,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GetUser } from './get-user.decorator';
import { JwtPayload } from './jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body('username') username: string, @Req() req: Request) {
    const token = await this.authService.login(username, req);
    if (!token) {
      throw new UnauthorizedException('Invalid username');
    }
    return {
      access_token: token,
    };
  }
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@GetUser() user: JwtPayload, @Req() req: Request) {
    return this.authService.logout(user, req);
  }
}
