import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateCommentDto {
  @IsInt({ message: 'post_id must be an integer' })
  post_id: number;

  @IsNotEmpty({ message: 'content should not be empty' })
  content: string;
}
