import { Module } from '@nestjs/common';
import { PlayerService } from './services/player.service';
import { PlayerController } from './controllers/player.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { User } from '../user/entities/user.entity';
import { HttpModule } from '@nestjs/axios';
import { PlayerProcessor } from './processors/player.processor';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Player]),
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
