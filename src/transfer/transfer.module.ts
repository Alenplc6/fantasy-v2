import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from 'src/player/entities/player.entity';
import { User } from 'src/user/entities';
import { TeamPlayer } from '../user/entities/team.entity';
import { TransferController } from './controllers/transfer.controller';
import { Transfer } from './entities/transfer.entity';
import { TransferService } from './services/transfer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transfer, User, Player, TeamPlayer])],
  controllers: [TransferController],
  providers: [TransferService],
})
export class TransferModule {}
