import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Process } from '@nestjs/bull';
import { PlayerService } from '../services/player.service';

@Processor('player-queue') // Specify which queue this processor listens to
export class PlayerProcessor extends WorkerHost {
  constructor(private readonly playerService: PlayerService) {
    super();
  }

  @Process('fetch-external-data')
  async process(): Promise<{ message: string }> {
    await this.playerService.fetchExternalData();
    return { message: 'points granted' };
  }
}
