import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PlayerPointService } from './player-point.service';

@Controller({
  path: 'player-point',
  version: '1',
})
export class PlayerPointController {
  constructor(private readonly playerPointService: PlayerPointService) {}

  @Get()
  findAll(
    @Query('query', new DefaultValuePipe('')) search: string,
    @Query('size', new DefaultValuePipe(0), ParseIntPipe) size: number,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
  ) {
    return this.playerPointService.findAll(search, size, page);
  }

  @Get('leader-board')
  leaderBoard() {
    return this.playerPointService.getRankedFantasyPointsBetweenDates();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playerPointService.findOne(+id);
  }
}
