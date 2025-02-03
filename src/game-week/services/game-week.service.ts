import { HttpService } from '@nestjs/axios';
import { InjectQueue } from '@nestjs/bullmq';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosError, AxiosResponse } from 'axios';
import { Queue } from 'bullmq';
import { CronJob } from 'cron';
import { catchError, firstValueFrom, map } from 'rxjs';
import { PlayerPoint } from 'src/player-point/entities/player-point.entity';
import { Repository } from 'typeorm';
import { FantasyPointService } from '../../fantasy-point/services/fantasy-point.service';
import { GameWeek } from '../entities/game-week.entity';
import { GameWeekTeam } from '../entities/team-game-week';

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

  async sync() {
    const data = await this.gameWeekRepository.find({
      where: { status_str: 'upcoming' },
    });

    for (let i = 0; i < data.length; i++) {
      const { mid, datestart } = data[i];
      const date = this.convertDateToCron(datestart.toString());
      this.addCronJob(`match-${mid}`, date, +mid);
    }

    return { message: 'Game Week Seed Successful' };
  }

  weeksSince(dateString: string): number {
    const givenDate: Date = new Date(dateString);
    const currentDate: Date = new Date();

    // Calculate the difference in milliseconds
    const diffInMs: number = currentDate.getTime() - givenDate.getTime();

    // Convert milliseconds to days, then to weeks
    const weeksPassed: number = Math.floor(
      diffInMs / (1000 * 60 * 60 * 24 * 7),
    );
    return weeksPassed;
  }

  async findAll(
    q: string,
    page: number,
    pageSize: number,
    // round?: string,
    // startDate?: Date,
    // endDate?: Date,
  ) {
    const query = this.gameWeekRepository
      .createQueryBuilder('gameWeek')
      .leftJoinAndSelect('gameWeek.home_team', 'homeTeam') // Ensure this is the correct relationship
      .leftJoinAndSelect('gameWeek.away_team', 'awayTeam') // Ensure this is the correct relationship
      .where('LOWER(homeTeam.tname) LIKE LOWER(:tname)', {
        tname: `%${q.toLocaleLowerCase()}%`,
      }); // Case-insensitive search

    const [data, total] = await query
      .skip((page - 1) * pageSize) // Calculate the offset
      .take(pageSize) // Limit the number of results
      .orderBy('gameWeek.datestart', 'ASC') // Sort results by `id` column
      .getManyAndCount(); // Execute the query and get results

    return {
      data,
      total,
      currentPage: page,
      pageSize,
    }; // Return the results
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
            `https://soccer.entitysport.com/competition/1118/matches?token=${process.env.ENTITY_SPORT_TOKEN}&per_page=${perPage}&paged=${currentPage}`,
          )
          .pipe(map((response: AxiosResponse) => response.data.response.items))
          .toPromise();

        if (!teams || teams.length === 0) {
          console.log('No more teams to fetch. Ending process.');
          // break;
        }

        for (const teamData of teams) {
          let homeTeam: any;
          let awayTeam: any;
          let competitionVenue: any;
          const home = await this.gameWeekTeamRepository.findBy({
            tid: teamData.teams.home.tid,
          });
          // console.log(teamData.teams);
          if (home.length > 0) {
            homeTeam = home[0];
          } else {
            homeTeam = await this.gameWeekTeamRepository.create(
              teamData.teams.home,
            );
          }

          const away = await this.gameWeekTeamRepository.findBy({
            tid: teamData.teams.away.tid,
          });

          if (away.length > 0) {
            awayTeam = away[0];
          } else {
            awayTeam = this.gameWeekTeamRepository.create(teamData.teams.away);
          }

          // const venue = await this.venueRepository.findBy({
          //   venueid: teamData.venue.venueid,
          // });

          // if (venue.length > 0) {
          //   competitionVenue = venue[0];
          // } else {
          //   competitionVenue = await this.venueRepository.create(
          //     teamData.venue,
          //   );
          // }

          const team = this.gameWeekRepository.create({
            ...teamData,
            venue: competitionVenue,
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
    currentPage++;
    return { message: 'Team fetching and saving process completed' };
  }

  async getTeamStat() {
    const results = await this.gameWeekRepository
      .createQueryBuilder('match')
      .select('home_team.id', 'id')
      .addSelect('home_team.tname', 'team_name')
      .addSelect('ANY_VALUE(home_team.logo)', 'logo')
      .addSelect(
        `CAST(SUM(CASE 
          WHEN JSON_EXTRACT(match.result, '$.winner') = 'home' AND match.home_team.id = home_team.id 
          THEN 1 
          WHEN JSON_EXTRACT(match.result, '$.winner') = 'away' AND match.away_team.id = home_team.id 
          THEN 1 
          ELSE 0 
         END) AS UNSIGNED)`,
        'wins',
      )
      .addSelect(
        `SUM(CASE 
          WHEN match.home_team.id = home_team.id 
          THEN JSON_EXTRACT(match.periods, '$.ft.home') 
          ELSE JSON_EXTRACT(match.periods, '$.ft.away') 
         END)`,
        'goals_scored',
      )
      .addSelect(
        `CAST(SUM(CASE 
          WHEN JSON_EXTRACT(match.result, '$.winner') = 'away' AND match.home_team.id = home_team.id 
          THEN 1 
          WHEN JSON_EXTRACT(match.result, '$.winner') = 'home' AND match.away_team.id = home_team.id 
          THEN 1 
          ELSE 0 
         END) AS UNSIGNED)`,
        'losses',
      )
      .addSelect(
        `CAST(SUM(CASE 
          WHEN JSON_EXTRACT(match.result, '$.winner') = '' OR JSON_EXTRACT(match.result, '$.winner') IS NULL 
          THEN 1 
          ELSE 0 
         END) AS UNSIGNED)`,
        'draws',
      )
      .addSelect(`CAST(COUNT(*) AS UNSIGNED)`, 'games_played')
      .addSelect(
        `SUM(CASE 
          WHEN match.home_team.id = home_team.id 
          THEN JSON_EXTRACT(match.periods, '$.ft.away') 
          ELSE JSON_EXTRACT(match.periods, '$.ft.home') 
         END)`,
        'goals_received',
      )
      .addSelect(
        `SUM(CASE 
          WHEN match.home_team.id = home_team.id 
          THEN JSON_EXTRACT(match.periods, '$.ft.home') 
          ELSE JSON_EXTRACT(match.periods, '$.ft.away') 
         END) 
       - 
     SUM(CASE 
          WHEN match.home_team.id = home_team.id 
          THEN JSON_EXTRACT(match.periods, '$.ft.away') 
          ELSE JSON_EXTRACT(match.periods, '$.ft.home') 
         END)`,
        'goal_difference',
      )
      .addSelect(
        `DENSE_RANK() OVER (ORDER BY 
          SUM(CASE 
                WHEN JSON_EXTRACT(match.result, '$.winner') = 'home' AND match.home_team.id = home_team.id 
                THEN 1 
                WHEN JSON_EXTRACT(match.result, '$.winner') = 'away' AND match.away_team.id = home_team.id 
                THEN 1 
                ELSE 0 
              END) DESC
        )`,
        'rank',
      )
      .innerJoin('match.home_team', 'home_team')
      .innerJoin('match.away_team', 'away_team')
      .where('match.gamestate_str = :gamestate', { gamestate: 'Ended' })
      .groupBy('home_team.id')
      .getRawMany();

    return results;
  }
  async getSingleTeamGames(
    id: number,
    q: string,
    page: number,
    pageSize: number,
  ) {
    const query = this.gameWeekRepository
      .createQueryBuilder('gameWeek')
      .leftJoinAndSelect('gameWeek.home_team', 'homeTeam') // Ensure this is the correct relationship
      .leftJoinAndSelect('gameWeek.away_team', 'awayTeam') // Ensure this is the correct relationship
      .leftJoinAndSelect('gameWeek.venue', 'venue') // Ensure this is the correct relationship
      .where('LOWER(homeTeam.tname) LIKE LOWER(:tname)', {
        tname: `%${q.toLocaleLowerCase()}%`,
      })
      .andWhere('homeTeam.id = :id', { id });

    const [data, total] = await query
      .skip((page - 1) * pageSize) // Calculate the offset
      .take(pageSize) // Limit the number of results
      .orderBy('gameWeek.datestart', 'ASC') // Sort results by `id` column
      .getManyAndCount(); // Execute the query and get results

    return {
      data,
      total,
      currentPage: page,
      pageSize,
    }; // Return the results
  }
}
