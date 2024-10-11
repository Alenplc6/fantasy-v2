import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTeamDto } from '../dto/create-team.dto';
import { UpdateTeamDto } from '../dto/update-team.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from '../entities';
import { ILike, Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { map } from 'rxjs';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    private readonly httpService: HttpService,
  ) {}

  async create(dto: CreateTeamDto) {
    const player = this.teamRepository.create(dto);
    await this.teamRepository.save(player);
    return player;
  }

  async findAll(q: string, pageSize: number, page: number) {
    const [data, total] = await this.teamRepository.findAndCount({
      where: { fullname: ILike(`%${q}%`) },
      skip: (page - 1) * pageSize, // calculate the offset
      take: pageSize, // limit the number of results
      order: {
        // Sort results, e.g., by `id` column
        id: 'DESC',
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
    const user = await this.teamRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('Player dose not exist', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async update(id: number, dto: UpdateTeamDto) {
    const user = await this.teamRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException('Player dose not exist', HttpStatus.BAD_REQUEST);
    }

    return await this.teamRepository.update(id, dto);
  }

  async remove(id: number) {
    const user = await this.teamRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('Player dose not exist', HttpStatus.BAD_REQUEST);
    }
    await this.teamRepository.delete(id);
    return { message: 'Player removed successfully' };
  }

  async getAllTeams() {
    const perPage = 50;
    let currentPage = 1;
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    while (true) {
      try {
        const teams = await this.httpService
          .get(
            `https://soccer.entitysport.com/teams?token=${process.env.ENTITY_SPORT_TOKEN}&per_page=${perPage}&paged=${currentPage}`,
          )
          .pipe(map((response: AxiosResponse) => response.data.response.items))
          .toPromise();

        if (!teams || teams.length === 0) {
          console.log('No more teams to fetch. Ending process.');
          break;
        }

        for (const teamData of teams) {
          const team = this.teamRepository.create(teamData);
          await this.teamRepository.save(team);
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
