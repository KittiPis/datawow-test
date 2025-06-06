import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity('login_logs')
export class LoginLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column()
  action: string; // ✅ NOT NULL ต้องใส่แน่ๆ

  @Column({ nullable: true })
  ip_address: string;

  @Column({ nullable: true })
  user_agent: string;

  @Column({ nullable: true })
  success: boolean;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn({ name: 'login_at' }) // redundancy (ใช้ created_at อย่างเดียวก็ได้)
  loginAt: Date;
}
