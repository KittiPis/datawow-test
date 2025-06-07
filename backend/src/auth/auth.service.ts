import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import { LoginLog } from '../../entities/login_log.entity';
import { Request } from 'express';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(LoginLog)
    private readonly logRepo: Repository<LoginLog>,
    private readonly jwtService: JwtService, // ✅ ต้องมี
  ) {}

  async login(username: string, req: Request): Promise<string | null> {
    const user = await this.userRepo.findOne({ where: { username } });

    if (!user) {
      await this.logRepo.save({
        action: 'login_failed : user not found : ' + username,
        success: false,
        ip_address: req.ip,
        user_agent: req.headers['user-agent'],
      });
      return null;
    }

    await this.logRepo.save({
      user,
      action: 'login_success',
      success: true,
      ip_address: req.ip,
      user_agent: req.headers['user-agent'],
    });

    const payload = { sub: user.id, username: user.username, role: user.role };
    const token: string = this.jwtService.sign(payload);
    return token;
  }
  async logout(user: JwtPayload, req: Request) {
    const foundUser = await this.userRepo.findOne({ where: { id: user.sub } });

    if (foundUser) {
      await this.logRepo.save({
        user: foundUser,
        action: 'logout successful',
        success: true,
        ip_address: req.ip,
        user_agent: req.headers['user-agent'],
      });

      return { message: 'Logout successful' };
    }

    await this.logRepo.save({
      action: 'logout_failed',
      success: false,
      ip_address: req.ip,
      user_agent: req.headers['user-agent'],
    });

    return { message: 'Logout failed: user not found' };
  }
}
