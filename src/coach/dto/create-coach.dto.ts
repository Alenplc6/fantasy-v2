import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCoachDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ name: 'name', type: String })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ name: 'clubName', type: String })
  clubName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ name: 'profileIMage', type: String })
  profileIMage: string;
}
