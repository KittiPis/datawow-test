import { IsNotEmpty, IsInt, MinLength } from 'class-validator';

export class PostDto {
  @IsInt({ message: 'category_id must be an integer' })
  category_id: number;

  @IsNotEmpty({ message: 'title should not be empty' })
  @MinLength(3, { message: 'title must be at least 3 characters' })
  title: string;

  @IsNotEmpty({ message: 'content should not be empty' })
  @MinLength(10, { message: 'content must be at least 10 characters' })
  content: string;
}
