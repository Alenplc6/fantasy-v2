import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFormationDtoOld } from '../dto/create-formation.dto';
import { UpdateFormationDto } from '../dto/update-formation.dto';
import { Formation } from '../entities/formation.entity';

@Injectable()
export class FormationService {
  constructor(
    @InjectRepository(Formation)
    private formationRepository: Repository<Formation>,
  ) {}

  async create(createFormationDto: CreateFormationDtoOld): Promise<Formation> {
    const Def = [];
    const Off = [];
    const Mid = [];
    const { name, defense, offense, midfield } = createFormationDto;

    for (let i = 0; i < defense; i++) {
      Def.push({ name: `Defense ${i + 1}` });
    }

    for (let j = 0; j < offense; j++) {
      Off.push({ name: `Offense ${j + 1}` });
    }

    for (let k = 0; k < midfield; k++) {
      Mid.push({ name: `Mid Field ${k + 1}` });
    }
    const formation = this.formationRepository.create({
      name,
      offense,
      midfield,
      defense,
      formationAlignment: JSON.stringify([
        { name: 'Defense', players: Def },
        { name: 'Mid Field', players: Mid },
        { name: 'Offense', players: Off },
      ]),
    });

    await this.formationRepository.save(formation);
    return formation;
  }

  async findAll(q: string, pageSize: number, page: number): Promise<any> {
    const [data, total] = await this.formationRepository.findAndCount({
      // where: { name: ILike(`%${q}%`) },
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

  async findOne(id: number): Promise<Formation> {
    const formation = await this.formationRepository.findOne({ where: { id } });
    if (!formation) {
      throw new NotFoundException(`Formation with ID "${id}" not found`);
    }
    return formation;
  }

  async update(id: number, updateFormationDto: UpdateFormationDto) {
    const { name, defense, midfield, offense } = updateFormationDto;

    const formationExist = await this.formationRepository.findOneBy({ id });
    if (!formationExist) {
      throw new HttpException(
        'formation dose not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const Defense = [];
    const Offense = [];
    const MidField = [];

    for (let i = 0; i < defense; i++) {
      Defense.push({ name: `Defense ${i + 1}` });
    }

    for (let j = 0; j < offense; j++) {
      Offense.push({ name: `Offense ${j + 1}` });
    }

    for (let k = 0; k < midfield; k++) {
      MidField.push({ name: `Mid Field ${k + 1}` });
    }

    const formation = await this.formationRepository.update(id, {
      name,
      offense,
      midfield,
      defense,
      formationAlignment: JSON.stringify([
        { name: 'Defense', players: Defense },
        { name: 'Offense', players: Offense },
        { name: 'Mid Field', players: MidField },
      ]),
    });

    return formation;
  }

  async remove(id: string): Promise<void> {
    const result = await this.formationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Formation with ID "${id}" not found`);
    }
  }
}
