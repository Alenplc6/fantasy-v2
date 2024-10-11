import { Test, TestingModule } from '@nestjs/testing';
import { PlayerPointController } from './player-point.controller';
import { PlayerPointService } from './player-point.service';

describe('PlayerPointController', () => {
  let controller: PlayerPointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerPointController],
      providers: [PlayerPointService],
    }).compile();

    controller = module.get<PlayerPointController>(PlayerPointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
