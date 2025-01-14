import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Highlight } from 'src/highlight/entities/highlight.entity';
import { News } from 'src/news/entities/news.entity';
import { Player } from 'src/player/entities/player.entity';
import { User } from 'src/user/entities';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
    @InjectRepository(News)
    private newsRepository: Repository<News>,
    @InjectRepository(Highlight)
    private highlightRepository: Repository<Highlight>,
  ) {}

  async findAll() {
    const [_users, _players, _news, _highlight] = await Promise.all([
      this.userRepository.count(), // Count records in User table
      this.playerRepository.count(), // Count records in Player table
      this.newsRepository.count(), // Count records in News table
      this.highlightRepository.count(), // Count records in Highlight table
    ]);

    return { _users, _players, _news, _highlight };
  }

  async getUsersCreatedByMonth(): Promise<Record<string, number>> {
    const result = await this.userRepository
      .createQueryBuilder('user')
      .select([
        // "DATE_FORMAT(user.createdAt, '%b') AS month", // Extract month abbreviation
        'MONTH(user.createdAt) AS monthNumber', // Numeric month for ordering
        'COUNT(user.id) AS total', // Aggregate count of users
      ])
      .groupBy('MONTH(user.createdAt)') // Group by numeric month
      .orderBy('monthNumber') // Order by numeric month
      .getRawMany();

    // Convert the result into a more user-friendly object
    return result.reduce(
      (acc, { month, total }) => {
        acc[month] = parseInt(total, 10);
        return acc;
      },
      {} as Record<string, number>,
    );
  }
}
