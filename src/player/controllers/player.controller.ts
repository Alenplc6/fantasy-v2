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
import { PlayerService } from '../services/player.service';
import { CreatePlayerDto } from '../dto/create-player.dto';
import { UpdatePlayerDto } from '../dto/update-player.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('player')
@Controller({
  path: 'player',
  version: '1',
})
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playerService.create(createPlayerDto);
  }

  @Get()
  findAll(
    @Param('position') position: string,
    @Query('query', new DefaultValuePipe('')) search: string,
    @Query('size', new DefaultValuePipe(0), ParseIntPipe) size: number,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
  ) {
    return this.playerService.findAll(position, search, size, page);
  }

  @Get('sync-plyers')
  findAllPlayers() {
    return this.playerService.getAllPlayers();
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
