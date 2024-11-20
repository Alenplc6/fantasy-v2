import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameWeekTeam } from 'src/game-week/entities/team-game-week';
import { FantasyPoint } from '../fantasy-point/entities/fantasy-point.entity';
import { GameWeek } from '../game-week/entities/game-week.entity';
import { User } from '../user/entities/user.entity';
import { PlayerController } from './controllers/player.controller';
import { Player } from './entities/player.entity';
import { PlayerProcessor } from './processors/player.processor';
import { PlayerService } from './services/player.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Player,
      GameWeekTeam,
      FantasyPoint,
      GameWeek,
    ]),
    HttpModule,
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'player-queue', // Name of the queue
    }),
    BullBoardModule.forFeature({
      name: 'player-queue',
      adapter: BullMQAdapter, //or use BullAdapter if you're using bull instead of bullMQ
    }),
  ],
  controllers: [PlayerController],
  providers: [PlayerService, PlayerProcessor],
})
export class PlayerModule {}
