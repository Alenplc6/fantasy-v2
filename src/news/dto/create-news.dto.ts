import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNewsDto {
  @ApiProperty({
    description: 'The title of the news article',
    example: 'Breaking News: Major Scientific Discovery',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Tags associated with the news article',
    example: 'science,discovery,research',
  })
  @IsNotEmpty()
  @IsString()
  tags: string;

  @ApiProperty({
    description: 'A detailed description of the news article',
    example:
      'Scientists have made a groundbreaking discovery that could revolutionize...',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'URL or path to the news article poster image',
    example: 'https://example.com/images/news-poster.jpg',
  })
  @IsNotEmpty()
  @IsString()
  poster: string;

  @ApiProperty({
    description: 'The source of the news article',
    example: 'Science Daily',
  })
  @IsNotEmpty()
  @IsString()
  source: string;
}
