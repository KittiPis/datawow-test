import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // 👇 เพิ่มเมธอดใหม่สำหรับ /healthz
  @Get('healthz')
  getHealthCheck() {
    return { status: 'ok' };
  }
}
