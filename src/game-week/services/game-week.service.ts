import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateGameWeekDto } from '../dto/create-game-week.dto';
import { UpdateGameWeekDto } from '../dto/update-game-week.dto';
import { GameWeek } from '../entities/game-week.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { FantasyPointService } from '../../fantasy-point/services/fantasy-point.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PlayerPoint } from 'src/player-point/entities/player-point.entity';

@Injectable()
export class GameWeekService {
  private readonly logger = new Logger(GameWeekService.name);

  constructor(
    @InjectRepository(GameWeek)
    private readonly gameWeekRepository: Repository<GameWeek>,
    private schedulerRegistry: SchedulerRegistry,
    private readonly httpService: HttpService,
    private readonly fantasyPointService: FantasyPointService,
    @InjectQueue('point-queue') private readonly pointQueue: Queue,
    @InjectRepository(PlayerPoint)
    private readonly playerPointRepository: Repository<PlayerPoint>,
  ) {}

  async getFantasyPoints() {
    const { data } = await firstValueFrom(
      this.httpService.get<any>('http://localhost:3001').pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );

    try {
      const points = [
        ...data.response.items.fantasy_points.home,
        ...data.response.items.fantasy_points.away,
      ];

      const mid = data.response.items.match_info.mid;
      const matchStatus = data.response.items.match_info.gamestate_str;

      console.log(matchStatus);

      if (matchStatus === 'Ended') {
        const gameWeek = await this.gameWeekRepository.findOneBy({ mid });
        await this.gameWeekRepository.update(gameWeek.id, {
          isGameEnded: true,
        });
        this.givePointsToPlayer(mid);
        // try {
        //   this.removeCronJob(`${gameWeek.id}`);
        // } catch (e) {
        //   console.log('e');
        // }
      } else {
        const res = await this.fantasyPointService.findAndRemove(mid);
        console.log(res);
      }

      const fantasy_points = points.map((item, index) => ({
        ...item,
        mid,
        index,
      }));

      return await this.fantasyPointService.createMany(fantasy_points);
    } catch (e) {
      console.log(e);
    }
  }

  async givePointsToPlayer(mid: number) {
    console.log('calculate points');
    await this.pointQueue.add('calculate-point', { mid });
    console.log('Job added to the queue');
  }

  convertDateToCron(dateString: string): string {
    console.log(dateString);
    // const date = new Date(dateString);

    // Extract minute, hour, day, and month
    // const minute = date.getUTCMinutes();
    // const hour = date.getUTCHours();
    // const day = date.getUTCDate();
    // const month = date.getUTCMonth() + 1;

    // return `* ${minute} ${hour} ${day} ${month} *`;
    return `1 * * * * *`;
  }

  // Method to add a cron job dynamically
  addCronJob(name: string, cronTime: string, mid: number) {
    console.log(cronTime, mid);
    const job = new CronJob(cronTime, () => {
      this.logger.log(`cron job excited ${new Date()}`);
      this.getFantasyPoints();
      // this.logger.warn(`Dynamic Cron job "${name}" running at ${cronTime}`);
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start(); // Start the cron job
    this.logger.warn(`Cron job "${name}" added for time: ${cronTime}`);
  }

  // Method to remove a cron job dynamically
  removeCronJob(name: string) {
    this.schedulerRegistry.deleteCronJob(name);
    this.logger.warn(`Cron job "${name}" deleted`);
  }

  // Optional: List all cron jobs
  getCronJobs() {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key) => {
      this.logger.log(`Cron Job: ${key}`);
    });
  }

  async create(dto: CreateGameWeekDto) {
    const { startTime, mid } = dto;
    const game = this.gameWeekRepository.create({ ...dto });
    const time = this.convertDateToCron(startTime);
    console.log(time);
    await this.gameWeekRepository.save(game);

    const pot = await this.playerPointRepository.create({
      playerId: 1,
      userId: 1,
      fantasyPointId: 631,
      point: 100,
    });

    // this will add crone job
    this.addCronJob(`${game.id}`, time, mid);
    return { game, pot };
  }

  async findAll(q: string, pageSize: number, page: number) {
    const [data, total] = await this.gameWeekRepository.findAndCount({
      skip: (page - 1) * pageSize, // calculate the offset
      take: pageSize, // limit the number of results
      order: {
        // Sort results, e.g., by `id` column
        id: 'ASC',
      },
    });

    return {
      data, // paginated data
      total, // total number of records
      currentPage: page,
      pageSize,
    };
  }

  async findOne(id: number) {
    const user = await this.gameWeekRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('user dose not exist', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateGameWeekDto) {
    const user = await this.gameWeekRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException('user dose not exist', HttpStatus.BAD_REQUEST);
    }

    return await this.gameWeekRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    const user = await this.gameWeekRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('user dose not exist', HttpStatus.BAD_REQUEST);
    }
    await this.gameWeekRepository.delete(id);
    return { message: 'User removed successfully' };
  }
}
