import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../../entities/post.entity';
import { CategoryEntity } from '../../entities/category.entity';
import { CommentEntity } from '../../entities/comment.entity';
import { UserEntity } from '../../entities/user.entity';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { PostDto } from './dto/post-summary.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,

    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,

    @InjectRepository(PostEntity)
    private readonly postRepo: Repository<PostEntity>,

    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,

    private readonly activityLogService: ActivityLogService,
  ) {}

  async getPostSummaries(limit = 10, offset = 0, categoryId?: number) {
    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'user')
      .leftJoinAndSelect('post.category', 'category')
      //   .where('COALESCE(post.is_active, true) = true')
      //   .andWhere('COALESCE(post.is_deleted, false) = false')
      //   .andWhere('COALESCE(post.is_hidden, false) = false')
      .orderBy('post.created_at', 'DESC')
      .skip(offset)
      .take(limit);

    if (categoryId) {
      query.andWhere('post.category_id = :categoryId', { categoryId });
    }

    const posts = await query.getMany();

    // ดึง comment count ต่อโพสต์
    const result = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await this.commentRepository.count({
          where: {
            post: { id: post.id },
            is_active: true,
            is_deleted: false,
          },
        });

        return {
          id: post.id,
          title: post.title,
          summary: post.content.slice(0, 200), // ตัด content ย่อ
          author: post.author?.username || 'Unknown',
          category: {
            id: post.category?.id,
            name: post.category?.name,
            slug: post.category?.slug,
          },
          comment_count: commentCount,
          created_at: post.created_at,
        };
      }),
    );

    return result;
  }

  async getPostDetail(postId: number) {
    // 1. ดึงโพสต์พร้อม author + category
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
        // is_active: true,
        // is_deleted: false,
        // is_hidden: false,
      },
      relations: ['author', 'category'],
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }

    // 2. ดึงคอมเมนต์ของโพสต์นั้น
    const comments = await this.commentRepository.find({
      where: {
        post: { id: postId },
        is_active: true,
        is_deleted: false,
      },
      relations: ['user'],
      order: {
        created_at: 'DESC',
      },
    });

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      created_at: post.created_at,
      author: {
        id: post.author.id,
        username: post.author.username,
      },
      category: post.category
        ? {
            id: post.category.id,
            name: post.category.name,
            slug: post.category.slug,
          }
        : null,
      comments: comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        user: {
          id: comment.user.id,
          username: comment.user.username,
        },
      })),
    };
  }

  async createPost(dto: PostDto, user: JwtPayload) {
    const category = await this.categoryRepo.findOneBy({
      id: dto.category_id,
      is_active: true,
    });

    if (!category) {
      throw new NotFoundException(
        `Category with id ${dto.category_id} not found or inactive`,
      );
    }

    const author = await this.userRepo.findOneBy({ id: user.sub });
    if (!author) {
      throw new NotFoundException(`User not found`);
    }

    const newPost = this.postRepo.create({
      title: dto.title,
      content: dto.content,
      category,
      author,
    });

    const saved = await this.postRepo.save(newPost);

    //log activity
    await this.activityLogService.logActivity({
      userId: user.sub,
      action: 'create_post',
      targetTable: 'posts_datawow',
      targetId: saved.id,
      description: `สร้างโพสต์ใหม่ในหมวดหมู่ ${category.name}`,
    });

    return {
      id: saved.id,
      title: saved.title,
      content: saved.content,
      created_at: saved.created_at,
      category: {
        id: category.id,
        name: category.name,
      },
      user: {
        id: author.id,
        username: author.username,
      },
    };
  }

  async updatePost(postId: number, dto: PostDto, user: JwtPayload) {
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }

    if (post.author.id !== user.sub) {
      throw new ForbiddenException(`You are not allowed to edit this post`);
    }

    const category = await this.categoryRepo.findOneBy({
      id: dto.category_id,
      is_active: true,
    });

    if (!category) {
      throw new NotFoundException(
        `Category with id ${dto.category_id} not found`,
      );
    }

    post.title = dto.title;
    post.content = dto.content;
    post.category = category;
    post.updated_at = new Date();

    const saved = await this.postRepo.save(post);

    await this.activityLogService.logActivity({
      userId: user.sub,
      action: 'edit_post',
      targetTable: 'posts_datawow',
      targetId: post.id,
      description: `แก้ไขโพสต์หัวข้อ "${post.title}"`,
    });

    return {
      id: saved.id,
      title: saved.title,
      content: saved.content,
      updated_at: saved.updated_at,
    };
  }

  async deletePost(postId: number, user: JwtPayload) {
    const post = await this.postRepo.findOne({
      where: { id: postId, is_active: true },
      relations: ['author'], // ต้องดึง author มาตรวจสอบสิทธิ์
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    }

    if (post.author.id !== user.sub) {
      throw new ForbiddenException('You are not allowed to delete this post');
    }

    post.is_active = false;
    await this.postRepo.save(post);

    await this.activityLogService.logActivity({
      userId: user.sub,
      action: 'delete_post',
      targetTable: 'posts_datawow',
      targetId: post.id,
      description: `ลบโพสต์หัวข้อ "${post.title}"`,
    });

    return {
      message: 'Post deleted successfully',
      id: post.id,
    };
  }

  async getMyPosts(userId: number, limit: number, offset: number) {
    const query = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .where('post.user_id = :userId', { userId })
      .andWhere('post.is_active = true')
      .andWhere('post.is_deleted = false')
      .andWhere('post.is_hidden = false')
      .orderBy('post.created_at', 'DESC')
      .skip(offset)
      .take(limit);

    const posts = await query.getMany();

    const results = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await this.commentRepository.count({
          where: {
            post: { id: post.id },
            is_active: true,
            is_deleted: false,
          },
        });

        return {
          id: post.id,
          title: post.title,
          content: post.content,
          created_at: post.created_at,
          comment_count: commentCount,
          category: post.category
            ? {
                id: post.category.id,
                name: post.category.name,
              }
            : null,
        };
      }),
    );

    return results;
  }
}
