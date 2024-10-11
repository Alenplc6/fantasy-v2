import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { GameWeekService } from '../services/game-week.service';
import { CreateGameWeekDto } from '../dto/create-game-week.dto';
import { UpdateGameWeekDto } from '../dto/update-game-week.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Game-Week')
@Controller({
  path: 'game-week',
  version: '1',
})
export class GameWeekController {
  constructor(private readonly gameWeekService: GameWeekService) {}

  @Post()
  create(@Body() createGameWeekDto: CreateGameWeekDto) {
    return this.gameWeekService.create(createGameWeekDto);
  }

  @Get()
  findAll(
    @Query('query', new DefaultValuePipe('')) search: string,
    @Query('size', new DefaultValuePipe(0), ParseIntPipe) size: number,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
  ) {
    return this.gameWeekService.findAll(search, size, page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameWeekService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGameWeekDto: UpdateGameWeekDto,
  ) {
    return this.gameWeekService.update(+id, updateGameWeekDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameWeekService.remove(+id);
  }

  //cron
  // @Post('add')
  // createCronJob(@Body('name') name: string, @Body('time') cronTime: string) {
  //   this.gameWeekService.addCronJob('test', '5 * * * * *');
  //   return `Cron job "${name}" added with time "${cronTime}"`;
  // }

  // @Delete('remove/:name')
  // removeCronJob(@Param('name') name: string) {
  //   this.gameWeekService.removeCronJob(name);
  //   return `Cron job "${name}" removed`;
  // }

  // @Post('list')
  // listCronJobs() {
  //   this.gameWeekService.getCronJobs();
  //   return 'Listing all cron jobs';
  // }
}
