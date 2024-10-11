import {
  IsString,
  IsOptional,
  IsUrl,
  Length,
  IsNotEmpty,
} from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  tid: string;

  @IsString()
  @IsNotEmpty()
  tname: string;

  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsString()
  @Length(2, 5)
  abbr: string;

  @IsString() // Ensure proper boolean transformation
  iscountry: string;

  @IsString()
  isclub: string;

  @IsString()
  @Length(4, 4)
  founded: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  twitter?: string;

  @IsOptional()
  @IsString()
  hashtag?: string;

  @IsString()
  @IsUrl()
  teamlogo: string;

  @IsString()
  @IsUrl()
  team_url: string;

  @IsString()
  @IsUrl()
  team_matches_url: string;
}
