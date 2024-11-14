import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosError } from 'axios';
import { CronJob } from 'cron';
import { catchError, firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { FantasyPointService } from '../../fantasy-point/services/fantasy-point.service';
import { GameWeek } from '../../game-week/entities/game-week.entity';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);
  constructor(
    private readonly httpService: HttpService,
    private schedulerRegistry: SchedulerRegistry,
    private readonly fantasyPointService: FantasyPointService,
    @InjectRepository(GameWeek)
    private readonly matchesRepository: Repository<GameWeek>,
  ) {}

  private async _getFantasyPoints(id: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get<any>(
            `https://soccer.entitysport.com/matches/${id}/newfantasy?token=${process.env.ENTITY_SPORT_TOKEN}`,
          )
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(error);
              throw new Error('An error happened!'); // Throwing an error
            }),
          ),
      );

      console.log(data);
      if (data.response.items.fantasy_points.length > 0) {
        // ... rest of your code ..
        const points = [
          ...data.response.items.fantasy_points.home,
          ...data.response.items.fantasy_points.away,
        ];

        const mid = data.response.items.match_info.mid;
        const matchStatus = data.response.items.match_info.gamestate_str;

        // checking if the game ended
        if (matchStatus === 'Ended') {
          const gameWeek = await this.matchesRepository.findOneBy({ mid });
          await this.matchesRepository.update(gameWeek.id, {
            ...data.response.items.match_info,
          });
        } else {
          await this.fantasyPointService.findAndRemove(mid);
        }

        const fantasy_points = points.map((item, index) => ({
          ...item,
          mid,
          index,
        }));
        return await this.fantasyPointService.createMany(fantasy_points);
      }
    } catch (error) {
      this.logger.error('Error fetching fantasy points:', error);
    }
  }

  // convert the date to cron job param
  private _convertDateToCron(dateString: string): string {
    const date = new Date(dateString);

    // Extract minute, hour, day, and month
    const minute = date.getUTCMinutes();
    const hour = date.getUTCHours();
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const weekDay = date.getDay();

    return `1 ${minute} ${hour} ${day} ${month} ${weekDay}`;
  }

  async _updateFantasyPoints(mid: string) {
    const match = await this.matchesRepository.findOneBy({ mid });
    if (match.status_str == 'ended') {
      // end the cron jon by name
      const job = this.schedulerRegistry.getCronJob(`${mid}-match`);
      const liveJob = this.schedulerRegistry.getCronJob(`${mid}-live-game`);
      if (job && liveJob) {
        job.stop(); // Stop the cron job
        liveJob.stop();
        this.schedulerRegistry.deleteCronJob(`${mid}-match`); // Optionally remove it from the registry
        this.schedulerRegistry.deleteCronJob(`${mid}-live-game`); // Optionally remove it from the registry
        this.logger.warn(`job ${mid}-match has been stopped!`);
      } else {
        this.logger.warn(`job ${mid} not found!`);
      }
      console.log('match', match.status_str);
    }

    // get fantasy points
    const job = new CronJob(`5 * * * * *`, () => {
      this.logger.warn(`every 5 second for job ${mid} to run!`);
      // this is where the get fantasy point logic will reside
      this._getFantasyPoints(mid);
    });

    this.schedulerRegistry.addCronJob(`${mid}-live-game`, job);
    job.start();

    this.logger.warn(
      `job ${mid}-live-game added for each minute at 1 seconds!`,
    );
  }

  async syncGameWeeks() {
    const matches = await this.matchesRepository.findBy({
      status_str: 'upcoming',
    });

    for (let i = 0; i < matches.length; i++) {
      this.syncGameWeekSchedule(
        matches[i].mid,
        this._convertDateToCron(matches[i].datestart.toISOString()),
        `${matches[i].mid}-match`,
      );
      console.log(this._convertDateToCron(matches[i].datestart.toDateString()));
    }
    return matches.length;
  }

  syncGameWeekSchedule(mid: string, time: string, name: string) {
    const job = new CronJob(`${time}`, () => {
      this._updateFantasyPoints(mid);
      this.logger.warn(`time (${time}) for job schedule to run!`);
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.logger.warn(`job ${name} added for ${time}!`);
  }
}
