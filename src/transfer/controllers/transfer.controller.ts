import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTransferDto } from '../dto';
import { UpdateTransferDto } from '../dto/update-transfer.dto';
import { Transfer } from '../entities/transfer.entity';
import { TransferService } from '../services/transfer.service';

@ApiTags('Transfer')
@Controller({
  path: 'transfer',
  version: '1',
})
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  async create(
    @Body() createTransferDto: CreateTransferDto,
  ): Promise<Transfer> {
    return await this.transferService.create(createTransferDto);
  }

  @Get()
  async findAll(): Promise<Transfer[]> {
    return this.transferService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Transfer> {
    return this.transferService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTransferDto: UpdateTransferDto,
  ): Promise<Transfer> {
    return this.transferService.update(id, updateTransferDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.transferService.remove(id);
  }
}
