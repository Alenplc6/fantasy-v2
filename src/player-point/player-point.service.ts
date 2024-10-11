import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerPoint } from './entities/player-point.entity';

@Injectable()
export class PlayerPointService {
  constructor(
    @InjectRepository(PlayerPoint)
    private readonly pointRepository: Repository<PlayerPoint>,
  ) {}

  async findAll(q: string, pageSize: number, page: number) {
    const [data, total] = await this.pointRepository.findAndCount({
      loadEagerRelations: true,
      skip: (page - 1) * pageSize, // calculate the offset
      take: pageSize, // limit the number of results
      order: {
        // Sort results, e.g., by `id` column
        id: 'ASC',
      },
      relations: ['user', 'player'],
    });

    return {
      data, // paginated data
      total, // total number of records
      currentPage: page,
      pageSize,
    };
  }

  async findOne(id: number) {
    const user = await this.pointRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('user dose not exist', HttpStatus.BAD_REQUEST);
    }
    return user;
  }
}
