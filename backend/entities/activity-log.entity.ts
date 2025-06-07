import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('activity_logs')
export class ActivityLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity | null;

  @Column()
  action: string;

  @Column({ nullable: true, type: 'varchar' })
  target_table?: string;

  @Column({ nullable: true, type: 'int' })
  target_id?: number;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @CreateDateColumn()
  created_at: Date;
}
