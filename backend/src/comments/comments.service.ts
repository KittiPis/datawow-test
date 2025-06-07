import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from '../../entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PostEntity } from '../../entities/post.entity';
import { UserEntity } from '../../entities/user.entity';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { ActivityLogService } from '../activity-log/activity-log.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepo: Repository<CommentEntity>,

    @InjectRepository(PostEntity)
    private readonly postRepo: Repository<PostEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,

    private readonly activityLogService: ActivityLogService,
  ) {}

  async createComment(
    dto: CreateCommentDto,
    user: JwtPayload, // มาจาก @GetUser()
  ) {
    const post = await this.postRepo.findOne({
      where: {
        id: dto.post_id,
        is_active: true,
        is_deleted: false,
        is_hidden: false,
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${dto.post_id} not found`);
    }

    const author = await this.userRepo.findOneBy({ id: user.sub });

    if (!author) {
      throw new NotFoundException('User not found');
    }

    const comment = this.commentRepo.create({
      content: dto.content,
      post,
      user: author, // ✅ ตอนนี้ไม่เป็น null แล้ว
    });

    const saved = await this.commentRepo.save(comment); // ✅ ไม่ใส่ array

    await this.activityLogService.logActivity({
      userId: user.sub,
      action: 'create_comment',
      targetTable: 'comments_datawow',
      targetId: saved.id,
      description: `เพิ่มความคิดเห็นในโพสต์ "${post.title}"`,
    });

    return {
      id: saved.id,
      content: saved.content,
      created_at: saved.created_at,
      user: {
        id: author.id,
        username: author.username,
      },
    };
  }
}
