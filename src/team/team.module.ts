import { Module } from '@nestjs/common';
import { TeamService } from './services/team.service';
import { TeamController } from './controllers/team.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Team]), HttpModule],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
