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
import { FantasyPointService } from '../services/fantasy-point.service';
import { CreateFantasyPointDto } from '../dto/create-fantasy-point.dto';
import { UpdateFantasyPointDto } from '../dto/update-fantasy-point.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('fantasy-point')
@Controller({
  path: 'fantasy-point',
  version: '1',
})
export class FantasyPointController {
  constructor(private readonly fantasyPointService: FantasyPointService) {}

  @Post()
  create(@Body() createFantasyPointDto: CreateFantasyPointDto) {
    return this.fantasyPointService.create(createFantasyPointDto);
  }

  @Get()
  findAll(
    @Query('query', new DefaultValuePipe('')) search: string,
    @Query('size', new DefaultValuePipe(0), ParseIntPipe) size: number,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
  ) {
    return this.fantasyPointService.findAll(search, size, page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fantasyPointService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFantasyPointDto: UpdateFantasyPointDto,
  ) {
    return this.fantasyPointService.update(+id, updateFantasyPointDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fantasyPointService.remove(+id);
  }
}
