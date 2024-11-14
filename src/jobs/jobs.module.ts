import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FantasyPointModule } from '../fantasy-point/fantasy-point.module';
import { GameWeek } from '../game-week/entities/game-week.entity';
import { JobsController } from './controllers/jobs.controller';
import { JobsService } from './services/jobs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameWeek]),
    HttpModule,
    FantasyPointModule,
  ],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
