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
import { CreateFormationDtoOld } from '../dto/create-formation.dto';
import { UpdateFormationDto } from '../dto/update-formation.dto';
import { FormationService } from '../services/formation.service';

@ApiTags('Formation')
@Controller({
  path: 'formation',
  version: '1',
})
export class FormationController {
  constructor(private readonly formationService: FormationService) {}

  @Post()
  create(@Body() createFormationDto: CreateFormationDtoOld) {
    return this.formationService.create(createFormationDto);
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
    return this.formationService.findAll(search, size, page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFormationDto: UpdateFormationDto,
  ) {
    return this.formationService.update(+id, updateFormationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formationService.remove(id);
  }
}
