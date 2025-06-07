import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityLogEntity } from '../../entities/activity-log.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLogEntity)
    private readonly logRepo: Repository<ActivityLogEntity>,
  ) {}

  async logActivity(options: {
    userId: number;
    action: string;
    targetTable?: string;
    targetId?: number;
    description?: string;
  }) {
    const log = new ActivityLogEntity();
    log.user = { id: options.userId } as UserEntity;
    log.action = options.action;
    log.target_table = options.targetTable ?? undefined;
    log.target_id = options.targetId ?? undefined;
    log.description = options.description ?? undefined;

    await this.logRepo.save(log);
  }
}
