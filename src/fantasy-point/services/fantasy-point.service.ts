import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFantasyPointDto } from '../dto/create-fantasy-point.dto';
import { UpdateFantasyPointDto } from '../dto/update-fantasy-point.dto';
import { FantasyPoint } from '../entities/fantasy-point.entity';

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

  async getGroupedData() {
    const groupedData = await this.fantasyPointRepository
      .createQueryBuilder('fp')
      .select('fp.pid', 'pid')
      .addSelect('SUM(fp.goalscored)', 'goalsScoredForward')
      .addSelect('SUM(fp.assist)', 'assists')
      .addSelect('SUM(fp.passes)', 'passesCompleted')
      .addSelect('SUM(fp.shotsontarget)', 'shotsOnTarget')
      .addSelect('SUM(fp.chancecreated)', 'chancesCreated')
      .addSelect('SUM(fp.interceptionwon)', 'interceptions')
      .addSelect('SUM(fp.cleansheet)', 'cleanSheets')
      .addSelect('SUM(fp.shotssaved)', 'shotsSaved')
      .addSelect('SUM(fp.penaltysaved)', 'penaltySaved')
      .addSelect('SUM(fp.tacklesuccessful)', 'tacklesWon')
      .addSelect('SUM(fp.yellowcard)', 'yellowCards')
      .addSelect('SUM(fp.redcard)', 'redCards')
      .addSelect('SUM(fp.owngoal)', 'ownGoals')
      .groupBy('fp.pid')
      .getRawMany();

    // Transform results into a more readable format if needed
    return groupedData.map((player) => ({
      pid: player.pid,
      goalsScoredForward: player.goalsScoredForward || 0,
      assists: player.assists || 0,
      passesCompleted: player.passesCompleted || 0,
      shotsOnTarget: player.shotsOnTarget || 0,
      chancesCreated: player.chancesCreated || 0,
      interceptions: player.interceptions || 0,
      cleanSheets: player.cleanSheets || 0,
      shotsSaved: player.shotsSaved || 0,
      penaltySaved: player.penaltySaved || 0,
      tacklesWon: player.tacklesWon || 0,
      yellowCards: player.yellowCards || 0,
      redCards: player.redCards || 0,
      ownGoals: player.ownGoals || 0,
    }));
  }
}
