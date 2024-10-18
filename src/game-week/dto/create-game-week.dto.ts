// src/dto/match.dto.ts
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

// Team DTO
class TeamDto {
  @ApiProperty({ example: '48' })
  @IsString()
  @IsNotEmpty()
  tid: string;

  @ApiProperty({ example: 'Tottenham' })
  @IsString()
  @IsNotEmpty()
  tname: string;

  @ApiProperty({ example: 'https://soccer.entitysport.com/assets/team/48.png' })
  @IsString()
  @IsNotEmpty()
  logo: string;

  @ApiProperty({ example: 'Tottenham Hotspur FC' })
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @ApiProperty({ example: 'TOT' })
  @IsString()
  @IsNotEmpty()
  abbr: string;
}

// Competition DTO
class CompetitionDto {
  @ApiProperty({ example: '1118' })
  @IsString()
  @IsNotEmpty()
  cid: string;

  @ApiProperty({ example: 'Premier League' })
  @IsString()
  @IsNotEmpty()
  cname: string;

  @ApiProperty({ example: '2024-08-16 00:00:00' })
  @IsString()
  @IsNotEmpty()
  startdate: string;

  @ApiProperty({ example: '2025-05-25 00:00:00' })
  @IsString()
  @IsNotEmpty()
  enddate: string;

  @ApiProperty({ example: '1723766400' })
  @IsString()
  @IsNotEmpty()
  startdatetimestamp: string;

  @ApiProperty({ example: '1748131200' })
  @IsString()
  @IsNotEmpty()
  endtdatetimestamp: string;

  @ApiProperty({ example: '24/25' })
  @IsString()
  @IsNotEmpty()
  year: string;

  @ApiProperty({ example: 'England' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: '2' })
  @IsString()
  @IsNotEmpty()
  tournament_id: string;

  @ApiProperty({ example: '2' })
  @IsString()
  @IsNotEmpty()
  category_id: string;

  @ApiProperty({ example: 'en' })
  @IsString()
  @IsNotEmpty()
  ioc: string;

  @ApiProperty({ example: '3' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ example: 'live' })
  @IsString()
  @IsNotEmpty()
  status_str: string;

  @ApiProperty({
    example:
      'https://soccer.entitysport.com/assets/competition/logo_5d514064bf591.png',
  })
  @IsString()
  @IsNotEmpty()
  logo: string;
}

// Venue DTO
class VenueDto {
  @ApiProperty({ example: '20' })
  @IsString()
  @IsNotEmpty()
  venueid: string;

  @ApiProperty({ example: 'Tottenham Stadium' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'London, England' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: '' })
  @IsOptional()
  @IsString()
  founded?: string;

  @ApiProperty({ example: '62000' })
  @IsString()
  @IsNotEmpty()
  capacity: string;

  @ApiProperty({ example: '' })
  @IsOptional()
  @IsString()
  googlecoords?: string;
}

export class MatchDto {
  @ApiProperty({ example: '250835' })
  @IsString()
  @IsNotEmpty()
  mid: string;

  @ApiProperty({ example: '17' })
  @IsString()
  @IsNotEmpty()
  round: string;

  @ApiProperty({ example: '170' })
  @IsString()
  @IsNotEmpty()
  match_number: string;

  @ApiProperty({
    example: {
      home: '0',
      away: '0',
      winner: '',
    },
  })
  @IsObject()
  result: {
    home: string;
    away: string;
    winner: string;
  };

  @ApiProperty({ type: () => TeamDto })
  @IsObject()
  home_team: TeamDto;

  @ApiProperty({ type: () => TeamDto })
  @IsObject()
  away_team: TeamDto;

  @ApiProperty({ example: '' })
  @IsOptional()
  @IsString()
  periods?: string;

  @ApiProperty({ example: '2024-12-22 16:30:00' })
  @IsString()
  @IsNotEmpty()
  datestart: string;

  @ApiProperty({ example: '2024-12-22 23:30:00' })
  @IsString()
  @IsNotEmpty()
  dateend: string;

  @ApiProperty({ example: '1734885000' })
  @IsString()
  @IsNotEmpty()
  timestampstart: string;

  @ApiProperty({ example: '1734910200' })
  @IsString()
  @IsNotEmpty()
  timestampend: string;

  @ApiProperty({ example: '0' })
  @IsString()
  @IsNotEmpty()
  injurytime: string;

  @ApiProperty({ example: '0' })
  @IsString()
  @IsNotEmpty()
  time: string;

  @ApiProperty({ example: 'upcoming' })
  @IsString()
  @IsNotEmpty()
  status_str: string;

  @ApiProperty({ example: '1' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ example: 'Not started' })
  @IsString()
  @IsNotEmpty()
  gamestate_str: string;

  @ApiProperty({ example: '1' })
  @IsString()
  @IsNotEmpty()
  gamestate: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  pre_squad: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  verified: boolean;

  @ApiProperty({ example: '' })
  @IsOptional()
  @IsString()
  periodlength?: string;

  @ApiProperty({ example: '' })
  @IsOptional()
  @IsString()
  numberofperiods?: string;

  @ApiProperty({ example: '' })
  @IsOptional()
  @IsString()
  attendance?: string;

  @ApiProperty({ example: '' })
  @IsOptional()
  @IsString()
  overtimelength?: string;

  @ApiProperty({ type: () => CompetitionDto })
  @IsObject()
  competition: CompetitionDto;

  @ApiProperty({ type: () => VenueDto })
  @IsObject()
  venue: VenueDto;

  @ApiProperty({ example: false })
  @IsBoolean()
  lineupavailable: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  projectionavailable: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  eventavailable: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  commentaryavailable: boolean;
}
