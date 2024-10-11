import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateGameWeekDto {
  @IsString()
  @ApiProperty({ type: String, description: 'title' })
  title: string;

  @IsNumber()
  @ApiProperty({ type: Number, description: 'mid' })
  mid: number;

  @IsString()
  @ApiProperty({ type: String, description: 'home' })
  home: string;

  @IsString()
  @ApiProperty({ type: String, description: 'away' })
  away: string;

  @IsString()
  @ApiProperty({ type: String, description: 'startTime' })
  startTime: string;
}
