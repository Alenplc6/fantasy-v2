import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFantasyPointDto } from '../dto/create-fantasy-point.dto';
import { UpdateFantasyPointDto } from '../dto/update-fantasy-point.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FantasyPoint } from '../entities/fantasy-point.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FantasyPointService {
  constructor(
    @InjectRepository(FantasyPoint)
    private readonly fantasyPointRepository: Repository<FantasyPoint>,
  ) {}

  async create(dto: CreateFantasyPointDto) {
    const point = this.fantasyPointRepository.create({ ...dto });
    await this.fantasyPointRepository.save(point);
    return point;
  }

  async createMany(dto: CreateFantasyPointDto[]) {
    const point = this.fantasyPointRepository.create(dto);
    await this.fantasyPointRepository.save(point);
    return point;
  }

  async findAll(q: string, pageSize: number, page: number) {
    const [data, total] = await this.fantasyPointRepository.findAndCount({
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
    const user = await this.fantasyPointRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('user dose not exist', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async update(id: number, dto: UpdateFantasyPointDto) {
    const user = await this.fantasyPointRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException('user dose not exist', HttpStatus.BAD_REQUEST);
    }

    return await this.fantasyPointRepository.update(id, dto);
  }

  async remove(id: number) {
    const user = await this.fantasyPointRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('user dose not exist', HttpStatus.BAD_REQUEST);
    }
    await this.fantasyPointRepository.delete(id);
    return { message: 'User removed successfully' };
  }

  async findAndRemove(mid: number) {
    return await this.fantasyPointRepository
      .createQueryBuilder()
      .delete() // Specify the delete operation
      .from(FantasyPoint) // The entity/table from which to delete records
      .where('mid = :mid', { mid }) // Condition for the records to delete
      .execute();
  }
}
