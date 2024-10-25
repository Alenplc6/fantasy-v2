import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Formation } from 'src/formation/entities/formation.entity';
import { Player } from '../player/entities/player.entity';
import { UserController } from './controllers/user.controller';
import { TeamPlayer } from './entities/team.entity';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, TeamPlayer, Player, Formation])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
