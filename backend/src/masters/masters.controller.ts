import { Controller, Get } from '@nestjs/common';
import { MastersService } from './masters.service';

@Controller('masters')
export class MastersController {
  constructor(private readonly mastersService: MastersService) {}

  @Get('categories')
  async getCategories() {
    return this.mastersService.getActiveCategories();
  }
}
