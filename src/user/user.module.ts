import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamPlayer } from './entities/team.entity';
import { Player } from '../player/entities/player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, TeamPlayer, Player])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
