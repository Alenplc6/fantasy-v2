import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePlayerDto } from '../dto/create-player.dto';
import { UpdatePlayerDto } from '../dto/update-player.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Player } from '../entities/player.entity';
import { AxiosResponse } from 'axios';
import {
  BehaviorSubject,
  map,
  tap,
  Observable,
  from,
  mergeMap,
  of,
  catchError,
} from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

const teams = [
  {
    id: 45,
    tid: '53',
    tname: 'Arsenal',
    fullname: 'Arsenal FC',
    abbr: 'ARS',
    iscountry: 'false',
    isclub: 'true',
    founded: '1886',
    website: '',
    twitter: 'Arsenal',
    hashtag: '#Gunners',
    teamlogo: 'https://soccer.entitysport.com/assets/team/53.png',
    team_url: 'team/53/info',
    team_matches_url: 'team/53/matches',
  },
  {
    id: 51,
    tid: '59',
    tname: 'Bournemouth',
    fullname: 'AFC Bournemouth',
    abbr: 'BRN',
    iscountry: 'false',
    isclub: 'true',
    founded: '1899',
    website: '',
    twitter: 'afcbournemouth',
    hashtag: '#AFCB',
    teamlogo: 'https://soccer.entitysport.com/assets/team/59.png',
    team_url: 'team/59/info',
    team_matches_url: 'team/59/matches',
  },
  {
    id: 38,
    tid: '46',
    tname: 'Brighton',
    fullname: 'Brighton & Hove Albion FC',
    abbr: 'BHA',
    iscountry: 'false',
    isclub: 'true',
    founded: '1901',
    website: '',
    twitter: 'OfficialBHAFC',
    hashtag: '#BHAFC',
    teamlogo: 'https://soccer.entitysport.com/assets/team/46.png',
    team_url: 'team/46/info',
    team_matches_url: 'team/46/matches',
  },
  {
    id: 34,
    tid: '42',
    tname: 'Burnley',
    fullname: 'Burnley FC',
    abbr: 'BUR',
    iscountry: 'false',
    isclub: 'true',
    founded: '1882',
    website: '',
    twitter: 'BurnleyOfficial',
    hashtag: '#BFC',
    teamlogo: 'https://soccer.entitysport.com/assets/team/42.png',
    team_url: 'team/42/info',
    team_matches_url: 'team/42/matches',
  },
  {
    id: 43,
    tid: '51',
    tname: 'Chelsea',
    fullname: 'Chelsea FC',
    abbr: 'CFC',
    iscountry: 'false',
    isclub: 'true',
    founded: '1905',
    website: '',
    twitter: 'ChelseaFC',
    hashtag: '#CFC',
    teamlogo: 'https://soccer.entitysport.com/assets/team/51.png',
    team_url: 'team/51/info',
    team_matches_url: 'team/51/matches',
  },
  {
    id: 35,
    tid: '43',
    tname: 'Crystal Palace',
    fullname: 'Crystal Palace',
    abbr: 'CRY',
    iscountry: 'false',
    isclub: 'true',
    founded: '1905',
    website: '',
    twitter: 'CPFC',
    hashtag: '#CPFC',
    teamlogo: 'https://soccer.entitysport.com/assets/team/43.png',
    team_url: 'team/43/info',
    team_matches_url: 'team/43/matches',
  },
  {
    id: 49,
    tid: '57',
    tname: 'Everton',
    fullname: 'Everton FC',
    abbr: 'EVE',
    iscountry: 'false',
    isclub: 'true',
    founded: '1878',
    website: '',
    twitter: 'Everton',
    hashtag: '#EFC',
    teamlogo: 'https://soccer.entitysport.com/assets/team/57.png',
    team_url: 'team/57/info',
    team_matches_url: 'team/57/matches',
  },
  {
    id: 46,
    tid: '54',
    tname: 'Fulham',
    fullname: 'Fulham FC',
    abbr: 'FUL',
    iscountry: 'false',
    isclub: 'true',
    founded: '1879',
    website: '',
    twitter: 'Fulham Football Club',
    hashtag: '#FFC',
    teamlogo: 'https://soccer.entitysport.com/assets/team/54.png',
    team_url: 'team/54/info',
    team_matches_url: 'team/54/matches',
  },
  {
    id: 47,
    tid: '55',
    tname: 'Liverpool',
    fullname: 'Liverpool FC',
    abbr: 'LIV',
    iscountry: 'false',
    isclub: 'true',
    founded: '1892',
    website: '',
    twitter: 'LFC',
    hashtag: '#LFC',
    teamlogo: 'https://soccer.entitysport.com/assets/team/55.png',
    team_url: 'team/55/info',
    team_matches_url: 'team/55/matches',
  },
  {
    id: 36,
    tid: '44',
    tname: 'Man City',
    fullname: 'Manchester City',
    abbr: 'MCI',
    iscountry: 'false',
    isclub: 'true',
    founded: '1880',
    website: '',
    twitter: 'ManCity',
    hashtag: '#ManCity',
    teamlogo: 'https://soccer.entitysport.com/assets/team/44.png',
    team_url: 'team/44/info',
    team_matches_url: 'team/44/matches',
  },
  {
    id: 41,
    tid: '49',
    tname: 'Man Utd',
    fullname: 'Manchester United FC',
    abbr: 'MUN',
    iscountry: 'false',
    isclub: 'true',
    founded: '1878',
    website: '',
    twitter: 'ManUtd',
    hashtag: '#MUFC',
    teamlogo: 'https://soccer.entitysport.com/assets/team/49.png',
    team_url: 'team/49/info',
    team_matches_url: 'team/49/matches',
  },
  {
    id: 221,
    tid: '229',
    tname: 'Newcastle',
    fullname: 'Newcastle United Jets FC',
    abbr: 'NJ',
    iscountry: 'false',
    isclub: 'true',
    founded: '2000',
    website: '',
    twitter: 'NEWCASTLE JETS FC',
    hashtag: '',
    teamlogo: 'https://soccer.entitysport.com/assets/team/229.png',
    team_url: 'team/229/info',
    team_matches_url: 'team/229/matches',
  },
  {
    id: 44,
    tid: '52',
    tname: 'Newcastle',
    fullname: 'Newcastle United FC',
    abbr: 'NEW',
    iscountry: 'false',
    isclub: 'true',
    founded: '1892',
    website: '',
    twitter: 'NUFC',
    hashtag: '#NUFC',
    teamlogo: 'https://soccer.entitysport.com/assets/team/52.png',
    team_url: 'team/52/info',
    team_matches_url: 'team/52/matches',
  },
  {
    id: 40,
    tid: '48',
    tname: 'Tottenham',
    fullname: 'Tottenham Hotspur FC',
    abbr: 'TOT',
    iscountry: 'false',
    isclub: 'true',
    founded: '1882',
    website: '',
    twitter: 'SpursOfficial',
    hashtag: '#THFC',
    teamlogo: 'https://soccer.entitysport.com/assets/team/48.png',
    team_url: 'team/48/info',
    team_matches_url: 'team/48/matches',
  },
  {
    id: 42,
    tid: '50',
    tname: 'West Ham',
    fullname: 'West Ham United FC',
    abbr: 'WHU',
    iscountry: 'false',
    isclub: 'true',
    founded: '1895',
    website: '',
    twitter: 'WestHamUtd',
    hashtag: '#WHUFC',
    teamlogo: 'https://soccer.entitysport.com/assets/team/50.png',
    team_url: 'team/50/info',
    team_matches_url: 'team/50/matches',
  },
  {
    id: 33,
    tid: '41',
    tname: 'Wolverhampton',
    fullname: 'Wolverhampton Wanderers',
    abbr: 'WOL',
    iscountry: 'false',
    isclub: 'true',
    founded: '1877',
    website: '',
    twitter: 'Wolves',
    hashtag: '#WOL',
    teamlogo: 'https://soccer.entitysport.com/assets/team/41.png',
    team_url: 'team/41/info',
    team_matches_url: 'team/41/matches',
  },
  {
    id: '633',
    tname: 'Aston Villa',
    logo: 'https://soccer.entitysport.com/assets/team/633.png',
    fullname: 'Aston Villa FC',
    abbr: 'AVL',
  },
  {
    id: '636',
    tname: 'Brentford',
    logo: 'https://soccer.entitysport.com/assets/team/636.png',
    fullname: 'Brentford FC',
    abbr: 'BRE',
  },
  {
    id: '630',
    tname: 'Ipswich',
    logo: 'https://soccer.entitysport.com/assets/team/630.png',
    fullname: 'Ipswich Town',
    abbr: 'IPS',
  },
  {
    id: '47',
    tname: 'Leicester',
    logo: 'https://soccer.entitysport.com/assets/team/47.png',
    fullname: 'Leicester City FC',
    abbr: 'LEI',
  },
  {
    id: '623',
    tname: 'Nottingham',
    logo: 'https://soccer.entitysport.com/assets/team/623.png',
    fullname: 'Nottingham Forest',
    abbr: 'NOF',
  },
  {
    id: '56',
    tname: 'Southampton',
    logo: 'https://soccer.entitysport.com/assets/team/56.png',
    fullname: 'Southampton FC',
    abbr: 'SOU',
  },
];
@Injectable()
export class PlayerService {
  private currentPage$ = new BehaviorSubject<number>(1);

  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    @InjectQueue('player-queue') private readonly playerQueue: Queue,
    private readonly httpService: HttpService,
  ) {}

  async create(dto: CreatePlayerDto) {
    const player = this.playerRepository.create({ ...dto });
    await this.playerRepository.save(player);
    return player;
  }

  async findAll(q: string, pageSize: number, page: number) {
    const [data, total] = await this.playerRepository.findAndCount({
      where: {
        fullName: ILike(`%${q}%`),
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
}
