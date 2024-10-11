import { IsNotEmpty, IsString, IsUrl, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHighlightDto {
  @ApiProperty({
    description: 'The title of the highlight',
    example: 'Amazing Goal in Final Match',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'A description of the highlight',
    example: 'Player scores an incredible goal from midfield',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The URL of the highlight video',
    example: 'https://example.com/videos/amazing-goal.mp4',
  })
  @IsNotEmpty()
  @IsUrl()
  videoUrl: string;
}
