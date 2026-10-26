import { Test, TestingModule } from '@nestjs/testing';
import { AppMailController } from './app-mail.controller';
import { AppMailService } from './app-mail.service';

describe('AppMailController', () => {
  let controller: AppMailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppMailController],
      providers: [AppMailService],
    }).compile();

    controller = module.get<AppMailController>(AppMailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
