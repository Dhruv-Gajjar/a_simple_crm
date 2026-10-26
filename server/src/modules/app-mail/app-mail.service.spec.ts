import { Test, TestingModule } from '@nestjs/testing';
import { AppMailService } from './app-mail.service';

describe('AppMailService', () => {
  let service: AppMailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppMailService],
    }).compile();

    service = module.get<AppMailService>(AppMailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
