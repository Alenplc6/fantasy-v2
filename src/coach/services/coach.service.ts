import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateCoachDto } from '../dto/create-coach.dto';
import { UpdateCoachDto } from '../dto/update-coach.dto';
import { Coach } from '../entities/coach.entity';

@Injectable()
export class CoachService {
  constructor(
    @InjectRepository(Coach)
    private coachRepository: Repository<Coach>,
  ) {}

  async create(createNewsDto: CreateCoachDto): Promise<Coach> {
    const news = this.coachRepository.create(createNewsDto);
    await this.coachRepository.save(news);
    return news;
  }

  async findAll(q: string, pageSize: number, page: number): Promise<any> {
    const [data, total] = await this.coachRepository.findAndCount({
      where: { name: ILike(`%${q}%`) },
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

  findOne(id: number): Promise<Coach> {
    return this.coachRepository.findOneOrFail({ where: { id } });
  }

  async update(id: number, updateNewsDto: UpdateCoachDto): Promise<Coach> {
    await this.coachRepository.update(id, updateNewsDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.coachRepository.delete(id);
  }
}
