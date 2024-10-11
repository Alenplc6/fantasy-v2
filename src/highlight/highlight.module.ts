import { Module } from '@nestjs/common';
import { HighlightService } from './services/highlight.service';
import { HighlightController } from './controllers/highlight.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Highlight } from './entities/highlight.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Highlight])],
  controllers: [HighlightController],
  providers: [HighlightService],
})
export class HighlightModule {}
