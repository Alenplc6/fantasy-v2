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
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateFantasyPointDto } from '../dto/create-fantasy-point.dto';
import { UpdateFantasyPointDto } from '../dto/update-fantasy-point.dto';
import { FantasyPointService } from '../services/fantasy-point.service';

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
  @ApiQuery({
    name: 'query',
    required: false,
    description: 'Filter teams by query',
  })
  findAll(
    @Query('size', new DefaultValuePipe(0), ParseIntPipe) size: number,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('query', new DefaultValuePipe('')) search?: string,
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
