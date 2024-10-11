import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHighlightDto } from '../dto/create-highlight.dto';
import { UpdateHighlightDto } from '../dto/update-highlight.dto';
import { Highlight } from '../entities/highlight.entity';
@Injectable()
export class HighlightService {
  constructor(
    @InjectRepository(Highlight)
    private highlightRepository: Repository<Highlight>,
  ) {}

  create(createNewsDto: CreateHighlightDto): Promise<Highlight> {
    const news = this.highlightRepository.create(createNewsDto);
    return this.highlightRepository.save(news);
  }

  async findAll(q: string, pageSize: number, page: number): Promise<any> {
    const [data, total] = await this.highlightRepository.findAndCount({
      // where: { title: ILike(`%${q}%`) },
      skip: (page - 1) * pageSize, // calculate the offset
      take: pageSize, // limit the number of results
      order: {
        // Sort results, e.g., by `id` column
        // id: 'ASC',
      },
    });

    return {
      data, // paginated data
      total, // total number of records
      currentPage: page,
      pageSize,
    };
  }

  findOne(id: string): Promise<Highlight> {
    return this.highlightRepository.findOneOrFail({ where: { id } });
  }

  async update(
    id: string,
    updateNewsDto: UpdateHighlightDto,
  ): Promise<Highlight> {
    await this.highlightRepository.update(id, updateNewsDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.highlightRepository.delete(id);
  }
}
