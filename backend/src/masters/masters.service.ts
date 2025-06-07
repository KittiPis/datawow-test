import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../../entities/category.entity';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class MastersService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async getActiveCategories(): Promise<CategoryDto[]> {
    const categories = await this.categoryRepository.find({
      where: { is_active: true },
      order: { id: 'ASC' },
    });

    // map entity → DTO
    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
    }));
  }
}
