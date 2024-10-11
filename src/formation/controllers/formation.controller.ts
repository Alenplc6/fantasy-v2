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
import { FormationService } from '../services/formation.service';
import { CreateFormationDtoOld } from '../dto/create-formation.dto';
import { UpdateFormationDto } from '../dto/update-formation.dto';
import { ApiTags } from '@nestjs/swagger';

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
  findAll(
    @Query('query', new DefaultValuePipe('')) search: string,
    @Query('size', new DefaultValuePipe(0), ParseIntPipe) size: number,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
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
