// export class CreateTransferDto {}
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
// DTOs
export class CreateTransferDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({ type: Number, description: 'gameWeek' })
  gameWeek: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({ type: Number, description: 'playerInId' })
  playerInId: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({ type: Number, description: 'playerOutId' })
  playerOutId: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({ type: Number, description: 'userId' })
  userId: number;

  @IsEnum(['free', 'wildcard', 'freehit', 'penalty'])
  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'transferType' })
  transferType: string;
}
