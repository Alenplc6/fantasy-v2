import { Module } from '@nestjs/common';
import { GameWeekService } from './services/game-week.service';
import { GameWeekController } from './controllers/game-week.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameWeek } from './entities/game-week.entity';
import { HttpModule } from '@nestjs/axios';
import { FantasyPointModule } from '../fantasy-point/fantasy-point.module';
import { BullModule } from '@nestjs/bullmq';
import { PointProcessor } from './processors/point.processor';
import { TeamPlayer } from 'src/user/entities/team.entity';
import { FantasyPoint } from 'src/fantasy-point/entities/fantasy-point.entity';
import { PlayerPoint } from 'src/player-point/entities/player-point.entity';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { Player } from 'src/player/entities/player.entity';
import { User } from 'src/user/entities/user.entity';
import { GameWeekTeam } from './entities/team-game-week';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      GameWeek,
      TeamPlayer,
      FantasyPoint,
      PlayerPoint,
      // Competition,
      GameWeekTeam,
      // Venue,
      Player,
      User,
    ]),
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
      name: 'point-queue', // Name of the queue
    }),
    BullBoardModule.forFeature({
      name: 'point-queue',
      adapter: BullMQAdapter, //or use BullAdapter if you're using bull instead of bullMQ
    }),
    HttpModule,
    FantasyPointModule,
  ],
  controllers: [GameWeekController],
  providers: [GameWeekService, PointProcessor],
})
export class GameWeekModule {}
