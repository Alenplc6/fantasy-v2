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
import { HighlightService } from '../services/highlight.service';
import { CreateHighlightDto } from '../dto/create-highlight.dto';
import { UpdateHighlightDto } from '../dto/update-highlight.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Highlight')
@Controller({ path: 'highlight', version: '1' })
export class HighlightController {
  constructor(private readonly highlightService: HighlightService) {}

  @Post()
  create(@Body() createHighlightDto: CreateHighlightDto) {
    return this.highlightService.create(createHighlightDto);
  }

  @Get()
  findAll(
    @Query('query', new DefaultValuePipe('')) search: string,
    @Query('size', new DefaultValuePipe(0), ParseIntPipe) size: number,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
  ) {
    return this.highlightService.findAll(search, size, page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.highlightService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateHighlightDto: UpdateHighlightDto,
  ) {
    return this.highlightService.update(id, updateHighlightDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.highlightService.remove(id);
  }
}
