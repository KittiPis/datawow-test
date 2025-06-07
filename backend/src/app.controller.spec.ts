import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Spectacular. Ready when you are."', () => {
      expect(appController.getSpectacular()).toBe('Spectacular. Ready when you are.');
    });
  });

  describe('/healthz', () => {
    it('should return status ok', () => {
      expect(appController.getHealthCheck()).toEqual({ status: 'ok' });
    });
  });
});
