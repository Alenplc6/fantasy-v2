import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CoachModule } from './coach/coach.module';
import { Coach } from './coach/entities/coach.entity';
import { FantasyPoint } from './fantasy-point/entities/fantasy-point.entity';
import { FantasyPointModule } from './fantasy-point/fantasy-point.module';
import { Formation } from './formation/entities/formation.entity';
import { FormationModule } from './formation/formation.module';
import { GameWeek } from './game-week/entities/game-week.entity';
import { GameWeekModule } from './game-week/game-week.module';
import { Highlight } from './highlight/entities/highlight.entity';
import { HighlightModule } from './highlight/highlight.module';
import { JobsModule } from './jobs/jobs.module';
import { News } from './news/entities/news.entity';
import { NewsModule } from './news/news.module';
import { PlayerPoint } from './player-point/entities/player-point.entity';
import { PlayerPointModule } from './player-point/player-point.module';
import { Player } from './player/entities/player.entity';
import { PlayerModule } from './player/player.module';
import { Team } from './team/entities';
import { TeamModule } from './team/team.module';
import { TransferModule } from './transfer/transfer.module';
import { TeamPlayer } from './user/entities/team.entity';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('MYSQL_PORT'),
        username: configService.get('MYSQL_USER'),
        password: configService.get('MYSQL_PASSWORD'),
        database: configService.get('MYSQL_DATABASE'),
        entities: [
          User,
          Player,
          TeamPlayer,
          GameWeek,
          FantasyPoint,
          PlayerPoint,
          Team,
          Highlight,
          News,
          Formation,
          Coach,
        ],
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter, // Or FastifyAdapter from `@bull-board/fastify`
    }),
    ScheduleModule.forRoot(),
    HttpModule,
    UserModule,
    AuthModule,
    PlayerModule,
    FantasyPointModule,
    PlayerPointModule,
    GameWeekModule,
    HighlightModule,
    NewsModule,
    TeamModule,
    FormationModule,
    JobsModule,
    TransferModule,
    CoachModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
