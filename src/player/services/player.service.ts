import { HttpService } from '@nestjs/axios';
import { InjectQueue } from '@nestjs/bullmq';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { Queue } from 'bullmq';
import {
  BehaviorSubject,
  Observable,
  catchError,
  from,
  map,
  mergeMap,
  of,
  tap,
} from 'rxjs';
import { FantasyPoint } from 'src/fantasy-point/entities/fantasy-point.entity';
import { GameWeekTeam } from 'src/game-week/entities/team-game-week';
import { ILike, Repository } from 'typeorm';
import { GameWeek } from '../../game-week/entities/game-week.entity';
import { CreatePlayerDto } from '../dto/create-player.dto';
import { UpdatePlayerDto } from '../dto/update-player.dto';
import { Player } from '../entities/player.entity';
@Injectable()
export class PlayerService {
  private currentPage$ = new BehaviorSubject<number>(1);

  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    @InjectRepository(FantasyPoint)
    private readonly fantasyPointRepository: Repository<FantasyPoint>,
    @InjectRepository(GameWeekTeam)
    private readonly gameWeekTeamRepository: Repository<GameWeekTeam>,
    @InjectRepository(GameWeek)
    private readonly gameWeekRepository: Repository<GameWeek>,
    @InjectQueue('player-queue') private readonly playerQueue: Queue,
    private readonly httpService: HttpService,
  ) {}

  async create(dto: CreatePlayerDto[]) {
    const player = this.playerRepository.create(dto);
    await this.playerRepository.save(player);
    return player;
  }

  async findAll(q: string, pageSize: number, page: number) {
    const [data, total] = await this.playerRepository.findAndCount({
      where: {
        // fullName: ILike(`%${q}%`),
      },
      skip: (page - 1) * pageSize, // calculate the offset
      take: pageSize, // limit the number of results
      order: {
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

  async findAllWithPosition(
    q: string,
    pageSize: number,
    page: number,
    position: string,
  ) {
    const [data, total] = await this.playerRepository.findAndCount({
      where: {
        fullName: ILike(`%${q.toLocaleLowerCase()}%`),
        positionName: position,
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
    const user = await this.playerRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('Player dose not exist', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async update(id: number, dto: UpdatePlayerDto) {
    const user = await this.playerRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException('Player dose not exist', HttpStatus.BAD_REQUEST);
    }

    return await this.playerRepository.update(id, dto);
  }

  async remove(id: number) {
    const user = await this.playerRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('Player dose not exist', HttpStatus.BAD_REQUEST);
    }
    await this.playerRepository.delete(id);
    return { message: 'Player removed successfully' };
  }

  //get all payers
  getAllPlayers(): Observable<any> {
    const totalPages = 5570;
    const perPage = 50;

    return from(Array.from({ length: totalPages }, (_, i) => i + 1)).pipe(
      mergeMap(
        (page) =>
          this.httpService
            .get(
              `https://soccer.entitysport.com/players?token=${process.env.ENTITY_SPORT_TOKEN}&per_page=${perPage}&paged=${page}`,
            )
            .pipe(
              map((response: AxiosResponse) => response.data.response.items),
              mergeMap((players: any[]) => from(players)),
              mergeMap((player) =>
                from(
                  this.playerRepository.findOne({ where: { pid: player.pid } }),
                ).pipe(
                  mergeMap((existingPlayer) => {
                    if (!existingPlayer) {
                      const newPlayer = this.playerRepository.create({
                        ...player,
                        fullName: player.fullname,
                        birthDateTimeStamp: player.birthdatetimestamp,
                        birthDate: new Date(player.birthdate),
                        positionType: player.positiontype,
                        positionName: player.positionname,
                        teamName: 'team',
                      });
                      return from(this.playerRepository.save(newPlayer)).pipe(
                        map(() => ({ ...player, isNew: true })),
                      );
                    }
                    return of({ ...player, isNew: false });
                  }),
                ),
              ),
              catchError((error) => {
                console.error(`Error processing page ${page}:`, error);
                return of({ error: true, page });
              }),
            ),
        5,
      ), // Concurrency limit of 5
      tap({
        next: (result) =>
          console.log(`Processed player: ${result.fullname || result.page}`),
        complete: () => console.log('All players processed'),
      }),
    );
  }

  async syncPlayers() {
    await this.playerQueue.add('fetch players data', null);
  }

  async fetchExternalData(): Promise<any> {
    const plenght = await this.playerRepository.count();
    const teams = await this.gameWeekTeamRepository.find();
    if (plenght <= 0) {
      try {
        for (let j = 0; j < teams.length; j++) {
          const response = await this.httpService
            .get(
              `https://soccer.entitysport.com/team/${teams[j].tid}/info?token=${process.env.ENTITY_SPORT_TOKEN}`,
              // `https://soccer.entitysport.com/team/53/info?token=${process.env.ENTITY_SPORT_TOKEN}`,
            )
            .toPromise();
          const players =
            response.data.response.items != null
              ? response.data.response.items[0]?.player
              : [];

          if (players.length > 0) {
            for (let i = 0; i < players.length; i++) {
              const newPlayer = this.playerRepository.create({
                ...players[i],
                fullName: players[i].fullname,
                birthDateTimeStamp: players[i].birthdatetimestamp,
                birthDate: players[i].birthdate
                  ? new Date(players[i].birthdate)
                  : new Date(),
                positionType: players[i].positiontype,
                positionName: players[i].positionname,
                teamName: teams[j].tname,
              });
              this.playerRepository.save(newPlayer);
            }
          }
        }
        return { message: 'Player sinc success' };
      } catch (error) {
        console.error('Error fetching data from external API:', error);
        throw new HttpException(
          'Failed to fetch data',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    return {
      message: 'player data has been already seed',
    };
  }

  async fetchFantasyPointData(): Promise<any> {
    // const plenght = await this.playerRepository.count();
    const teams = await this.gameWeekRepository.find({
      where: {
        gamestate_str: 'Ended',
      },
    });

    // console.log(teams[0]);
    try {
      for (let j = 0; j < teams.length; j++) {
        const response = await this.httpService
          .get(
            `https://soccer.entitysport.com/matches/${teams[j].mid}/newfantasy?token=${process.env.ENTITY_SPORT_TOKEN}`,
          )
          .toPromise();
        const points =
          response.data.response.items != null
            ? response.data.response.items?.fantasy_points
            : null;
        if (points.home != null && points.away != null) {
          if (points.home.length > 0 && points.away.length > 0) {
            const fantasyPoints = [...points.home, ...points.away];
            // console.log(points.home[0]);
            if (fantasyPoints.length > 0) {
              for (let i = 0; i < fantasyPoints.length; i++) {
                const fantasyPoint = this.fantasyPointRepository.create({
                  mid: teams[j].mid,
                  ...fantasyPoints[i],
                });
                console.log(fantasyPoint);
                await this.fantasyPointRepository.save(fantasyPoint);
              }
            }
          } else {
            // continue;
            console.log(points);
          }
        }
        console.log(points.home != null);
      }

      return { message: 'Player sinc success' };
    } catch (error) {
      console.error('Error fetching data from external API:', error);
      throw new HttpException(
        'Failed to fetch data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      message: 'player data has been already seed',
    };
  }
}
