import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getSpectacular(): string {
    return 'Spectacular. Ready when you are.';
  }
}
