import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';
import { PlayerModule } from './player/player.module';
import { FantasyPointModule } from './fantasy-point/fantasy-point.module';
import { PlayerPointModule } from './player-point/player-point.module';
import { GameWeekModule } from './game-week/game-week.module';
import { Player } from './player/entities/player.entity';
import { TeamPlayer } from './user/entities/team.entity';
import { GameWeek } from './game-week/entities/game-week.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { FantasyPoint } from './fantasy-point/entities/fantasy-point.entity';
import { PlayerPoint } from './player-point/entities/player-point.entity';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { HighlightModule } from './highlight/highlight.module';
import { NewsModule } from './news/news.module';
import { TeamModule } from './team/team.module';
import { Team } from './team/entities';
import { FormationModule } from './formation/formation.module';
import { News } from './news/entities/news.entity';
import { Formation } from './formation/entities/formation.entity';
import { Highlight } from './highlight/entities/highlight.entity';
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
