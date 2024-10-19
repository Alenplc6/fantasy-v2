import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { GameWeek } from '../entities/game-week.entity';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { catchError, firstValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { FantasyPointService } from '../../fantasy-point/services/fantasy-point.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PlayerPoint } from 'src/player-point/entities/player-point.entity';
import { MatchDto } from '../dto/create-game-week.dto';
import { GameWeekTeam } from '../entities/team-game-week';
import { Competition } from '../entities/competition';
import { Venue } from '../entities/venue';

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
    @InjectRepository(GameWeekTeam)
    private readonly gameWeekTeamRepository: Repository<GameWeekTeam>,
    @InjectRepository(Competition)
    private readonly competitionRepository: Repository<Competition>,
    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,
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
          status_str: 'ended',
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
    const date = new Date(dateString);

    // Extract minute, hour, day, and month
    const minute = date.getUTCMinutes();
    const hour = date.getUTCHours();
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;

    return `* ${minute} ${hour} ${day} ${month} *`;
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

  // Create a new match
  async create(matchData: Partial<MatchDto>): Promise<GameWeek> {
    const match = this.gameWeekRepository.create(matchData);
    return await this.gameWeekRepository.save(match);
  }

  async sync() {
    const data = await this.gameWeekRepository.find({
      where: { status_str: 'upcoming' },
    });

    for (let i = 0; i < data.length; i++) {
      const { mid, datestart } = data[i];
      const date = this.convertDateToCron(datestart);
      this.addCronJob(`match-${mid}`, date, +mid);
    }

    return { message: 'Game Week Seed Successful' };
  }

  async findAll(q: string, pageSize: number, page: number) {
    const [data, total] = await this.gameWeekRepository.findAndCount({
      where: {
        home_team: {
          tname: ILike(`%${q.toLocaleLowerCase()}%`),
        },
      },
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

  async syncMatches() {
    const perPage = 50;
    let currentPage = 1;
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    while (true) {
      try {
        const teams = await this.httpService
          .get(
            `https://soccer.entitysport.com/competition/1118/matches?token=${process.env.ENTITY_SPORT_TOKEN}&status=1&per_page=${perPage}&paged=${currentPage}`,
          )
          .pipe(map((response: AxiosResponse) => response.data.response.items))
          .toPromise();

        if (!teams || teams.length === 0) {
          console.log('No more teams to fetch. Ending process.');
          break;
        }

        for (const teamData of teams) {
          const homeTeam = this.gameWeekTeamRepository.create(
            teamData.teams.home,
          );
          const awayTeam = this.gameWeekTeamRepository.create(
            teamData.teams.away,
          );
          const team = this.gameWeekRepository.create({
            ...teamData,
            home_team: homeTeam,
            away_team: awayTeam,
          });
          await this.gameWeekRepository.save(team);
        }

        console.log(`Processed page ${currentPage}`);
        currentPage++;

        // Wait for 1 second before the next API call
        await delay(1000);
      } catch (error) {
        console.error(
          `Error fetching teams on page ${currentPage}:`,
          error.message,
        );
        break;
      }
    }

    return { message: 'Team fetching and saving process completed' };
  }
}
