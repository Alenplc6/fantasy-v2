import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePlayerDto {
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ type: Number, description: 'pid' })
  pid: number;
  @IsString()
  @ApiProperty({ type: String, description: 'fullName' })
  fullName: string;
  @IsString()
  @ApiProperty({ type: Date, description: 'birthDate' })
  birthDate: Date;
  @IsString()
  @ApiProperty({ type: String, description: 'positionType' })
  positionType: string;
  @IsString()
  @ApiProperty({ type: String, description: 'positionName' })
  positionName: string;
  @IsString()
  @ApiProperty({ type: String, description: 'teamName' })
  teamName: string;
  @IsString()
  @ApiProperty({ type: String, description: 'height' })
  height: string;
  @IsString()
  @ApiProperty({ type: String, description: 'weight' })
  weight: string;
  @IsString()
  @ApiProperty({ type: String, description: 'foot' })
  foot: string;
  @IsString()
  @ApiProperty({ type: String, description: 'fantasy_player_rating' })
  fantasy_player_rating: string;
}
