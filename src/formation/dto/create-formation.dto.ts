import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class PlayerDto {
  @ApiProperty({ description: 'The name of the player' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class FormationAlignmentDto {
  @ApiProperty({ description: 'The name of the formation alignment' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: [PlayerDto],
    description: 'The players in this alignment',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => PlayerDto)
  players: PlayerDto[];
}

export class CreateFormationDto {
  @ApiProperty({ description: 'The name of the formation' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: [FormationAlignmentDto],
    description: 'The formation alignments',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => FormationAlignmentDto)
  formationAlignment: FormationAlignmentDto[];
}

export class CreateFormationDtoOld {
  @IsString()
  @ApiProperty({ type: String, description: 'name' })
  name: string;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ type: Number, description: 'defense' })
  defense: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ type: Number, description: 'midField' })
  midfield: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ type: Number, description: 'offense' })
  offense: number;
}
