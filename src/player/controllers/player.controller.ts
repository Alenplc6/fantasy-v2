import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePlayerDto } from '../dto/create-player.dto';
import { UpdatePlayerDto } from '../dto/update-player.dto';
import { PlayerService } from '../services/player.service';

@ApiTags('player')
@Controller({
  path: 'player',
  version: '1',
})
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  create(@Body() createPlayerDto: CreatePlayerDto[]) {
    return this.playerService.create(createPlayerDto);
  }

  @Get('')
  findAll(
    @Query('query', new DefaultValuePipe('')) search: string,
    @Query('size', new DefaultValuePipe(0), ParseIntPipe) size: number,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
  ) {
    return this.playerService.findAll(search, size, page);
  }

  @Get('position')
  find(
    @Query('position') position: string,
    @Query('query', new DefaultValuePipe('')) search: string,
    @Query('size', new DefaultValuePipe(0), ParseIntPipe) size: number,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
  ) {
    return this.playerService.findAllWithPosition(search, size, page, position);
  }

  @Get('sync-plyers')
  findAllPlayers() {
    return this.playerService.fetchExternalData();
  }

  @Get('sync-fantasy')
  fetchFantasyPointData() {
    return this.playerService.fetchFantasyPointData();
  }

  // @Get(':position')
  // findAll(
  //   @Param('position') position: string,
  //   @Query('query', new DefaultValuePipe('')) search: string,
  //   @Query('size', new DefaultValuePipe(0), ParseIntPipe) size: number,
  //   @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
  // ) {
  //   return this.playerService.findAll(position, search, size, page);
  // }

  @Get(':id/detail')
  findOne(@Param('id') id: string) {
    return this.playerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.playerService.update(+id, updatePlayerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playerService.remove(+id);
  }
}
