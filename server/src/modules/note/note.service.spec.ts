import { Test, TestingModule } from '@nestjs/testing';
import { NoteService } from './note.service';
import { NoteRepository } from './repositories/note.repository';
import { PinoLogger } from 'nestjs-pino';

describe('NoteService', () => {
  let service: NoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoteService,
        {
          provide: NoteRepository,
          useValue: {},
        },
        {
          provide: PinoLogger,
          useValue: {
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NoteService>(NoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
