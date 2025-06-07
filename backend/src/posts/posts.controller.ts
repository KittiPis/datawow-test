import {
  Controller,
  Get,
  Query,
  Param,
  Delete,
  ParseIntPipe,
  BadRequestException,
  Post,
  Body,
  UseGuards,
  ValidationPipe,
  Patch,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostDto } from './dto/post-summary.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('summary')
  async getPostSummaries(
    @Query('limit', new ParseIntPipe({ errorHttpStatusCode: 400 })) limit = 10,
    @Query('offset', new ParseIntPipe({ errorHttpStatusCode: 400 })) offset = 0,
    @Query('category_id') categoryId?: string,
  ) {
    if (limit < 1) {
      throw new BadRequestException('limit must be greater than 0');
    }

    if (offset < 0) {
      throw new BadRequestException('offset must be 0 or greater');
    }

    const parsedCategoryId = categoryId ? parseInt(categoryId, 10) : undefined;

    return this.postsService.getPostSummaries(limit, offset, parsedCategoryId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-posts')
  async getMyPosts(
    @GetUser() user: JwtPayload,
    @Query('limit', new ParseIntPipe({ errorHttpStatusCode: 400 })) limit = 10,
    @Query('offset', new ParseIntPipe({ errorHttpStatusCode: 400 })) offset = 0,
  ) {
    return this.postsService.getMyPosts(user.sub, limit, offset);
  }

  @Get(':id')
  async getPostDetail(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: 400 })) id: number,
  ) {
    return this.postsService.getPostDetail(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(
    @Body(new ValidationPipe({ whitelist: true })) dto: PostDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.postsService.createPost(dto, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true })) dto: PostDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.postsService.updatePost(id, dto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deletePost(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: JwtPayload,
  ) {
    return this.postsService.deletePost(id, user);
  }
}
