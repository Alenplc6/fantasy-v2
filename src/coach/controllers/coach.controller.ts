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
import { CreateCoachDto } from '../dto/create-coach.dto';
import { UpdateCoachDto } from '../dto/update-coach.dto';
import { CoachService } from '../services/coach.service';

@ApiTags('Coach')
@Controller({
  path: 'coach',
  version: '1',
})
export class CoachController {
  constructor(private readonly coachService: CoachService) {}

  @Post()
  create(@Body() createCoachDto: CreateCoachDto) {
    return this.coachService.create(createCoachDto);
  }

  @Get()
  findAll(
    @Query('query', new DefaultValuePipe('')) search: string,
    @Query('size', new DefaultValuePipe(0), ParseIntPipe) size: number,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
  ) {
    return this.coachService.findAll(search, size, page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coachService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoachDto: UpdateCoachDto) {
    return this.coachService.update(+id, updateCoachDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coachService.remove(+id);
  }
}
