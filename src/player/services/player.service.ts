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

@Injectable()
export class PlayerService {
  private currentPage$ = new BehaviorSubject<number>(1);

  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    private readonly httpService: HttpService,
  ) {}

  async create(dto: CreatePlayerDto) {
    const player = this.playerRepository.create({ ...dto });
    await this.playerRepository.save(player);
    return player;
  }

  async findAll(q: string, pageSize: number, page: number, position?: string) {
    const [data, total] = await this.playerRepository.findAndCount({
      where: {
        fullName: ILike(`%${q.toLocaleLowerCase()}%`),
        positionName: ILike(`%${position.toLocaleLowerCase}%`),
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
}
