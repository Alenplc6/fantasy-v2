import { Module } from '@nestjs/common';
import { PlayerPointService } from './player-point.service';
import { PlayerPointController } from './player-point.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerPoint } from './entities/player-point.entity';
import { Player } from 'src/player/entities/player.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlayerPoint, Player, User])],
  controllers: [PlayerPointController],
  providers: [PlayerPointService],
})
export class PlayerPointModule {}
