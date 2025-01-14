import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Highlight } from 'src/highlight/entities/highlight.entity';
import { News } from 'src/news/entities/news.entity';
import { Player } from 'src/player/entities/player.entity';
import { User } from 'src/user/entities';
import { DashboardController } from './controllers';
import { DashboardService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([User, Player, News, Highlight])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
