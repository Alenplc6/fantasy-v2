import { PartialType } from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateHighlightDto } from './create-highlight.dto';

export class UpdateHighlightDto extends PartialType(CreateHighlightDto) {
  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  videoUrl?: string;
}
