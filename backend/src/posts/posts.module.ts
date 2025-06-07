import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostEntity } from '../../entities/post.entity';
import { CommentEntity } from '../../entities/comment.entity';
import { UserEntity } from '../../entities/user.entity';
import { CategoryEntity } from '../../entities/category.entity';
import { ActivityLogModule } from '../activity-log/activity-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostEntity,
      CommentEntity,
      UserEntity,
      CategoryEntity,
    ]),
    ActivityLogModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
