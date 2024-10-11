// email.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bullmq';
import { FantasyPoint } from '../../fantasy-point/entities/fantasy-point.entity';
import { TeamPlayer } from '../../user/entities/team.entity';
import { Repository } from 'typeorm';
import { PlayerPoint } from 'src/player-point/entities/player-point.entity';
import { Player } from 'src/player/entities/player.entity';
import { User } from 'src/user/entities/user.entity';

@Processor('point-queue') // Specify which queue this processor listens to
export class PointProcessor extends WorkerHost {
  constructor(
    @InjectRepository(TeamPlayer)
    private readonly teamPlayerRepository: Repository<TeamPlayer>,
    @InjectRepository(FantasyPoint)
    private readonly fantasyPointRepository: Repository<FantasyPoint>,
    @InjectRepository(PlayerPoint)
    private readonly playerPointRepository: Repository<PlayerPoint>,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  async process(job: Job<any>): Promise<{ message: string }> {
    const { mid } = job.data;

    //this will get all the fantasy points
    const fantasyPoints = await this.fantasyPointRepository.find({
      where: { mid: mid },
    });

    fantasyPoints.map(async (point: any) => {
      const { pid } = point;
      //find players that has this player as team
      const users: any = await this.teamPlayerRepository.find({
        where: { pid },
      });

      for (let i = 0; i < users.length; i++) {
        const player = await this.playerRepository.findOneBy({
          id: users[i].playerId,
        });

        const user = await this.userRepository.findOneBy({
          id: users[i].userId,
        });

        const player_point = this.playerPointRepository.create({
          player: player,
          user: user,
          fantasyPoint: point,
          point: 50,
        });
        await this.playerPointRepository.save(player_point);
      }
    });
    return { message: 'points granted' };
  }
}
