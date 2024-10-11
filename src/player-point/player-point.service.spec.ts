import { Test, TestingModule } from '@nestjs/testing';
import { PlayerPointService } from './player-point.service';

describe('PlayerPointService', () => {
  let service: PlayerPointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerPointService],
    }).compile();

    service = module.get<PlayerPointService>(PlayerPointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
