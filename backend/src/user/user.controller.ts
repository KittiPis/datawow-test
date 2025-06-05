import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // GET /users → ดึงผู้ใช้ทั้งหมด
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // GET /users/:id → ดึงผู้ใช้ตาม ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
