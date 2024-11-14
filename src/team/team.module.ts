import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameWeekTeam } from 'src/game-week/entities/team-game-week';
import { TeamController } from './controllers/team.controller';
import { Team } from './entities';
import { TeamService } from './services/team.service';

@Module({
  imports: [TypeOrmModule.forFeature([Team, GameWeekTeam]), HttpModule],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
