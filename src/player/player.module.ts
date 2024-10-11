import { Module } from '@nestjs/common';
import { PlayerService } from './services/player.service';
import { PlayerController } from './controllers/player.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { User } from '../user/entities/user.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([User, Player]), HttpModule],
  controllers: [PlayerController],
  providers: [PlayerService],
})
export class PlayerModule {}
