import { Module } from '@nestjs/common';
import { FantasyPointService } from './services/fantasy-point.service';
import { FantasyPointController } from './controllers/fantasy-point.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FantasyPoint } from './entities/fantasy-point.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FantasyPoint])],
  controllers: [FantasyPointController],
  providers: [FantasyPointService],
  exports: [FantasyPointService],
})
export class FantasyPointModule {}
