// ✅ ต้องมี import เพิ่มเติม
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  // 👇 เพิ่มให้รองรับ find by ID
  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }
}
