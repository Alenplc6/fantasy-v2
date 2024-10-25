import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @ApiProperty({ type: String, description: 'coachName' })
  coachName: string;

  @IsNumber()
  @ApiProperty({ type: String, description: 'formation' })
  formation: number;
}
