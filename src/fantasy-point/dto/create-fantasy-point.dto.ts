import { IsInt, IsString, Min, Max } from 'class-validator';

export class CreateFantasyPointDto {
  @IsInt()
  pid: number;

  @IsString()
  pname: string;

  @IsInt()
  @Min(0)
  @Max(120)
  minutesplayed: number;

  @IsInt()
  @Min(0)
  assist: number;

  @IsInt()
  @Min(0)
  passes: number;

  @IsInt()
  @Min(0)
  shotsontarget: number;

  @IsInt()
  @Min(0)
  yellowcard: number;

  @IsInt()
  @Min(0)
  redcard: number;

  @IsInt()
  @Min(0)
  owngoal: number;

  @IsInt()
  @Min(0)
  penaltymissed: number;

  @IsInt()
  @Min(0)
  tacklesuccessful: number;

  @IsInt()
  @Min(0)
  penaltysaved: number;

  @IsInt()
  @Min(0)
  shotssaved: number;

  @IsInt()
  @Min(0)
  goalscored: number;

  @IsInt()
  @Min(0)
  goalsconceded: number;

  @IsInt()
  @Min(0)
  @Max(1)
  cleansheet: number;

  @IsInt()
  @Min(0)
  chancecreated: number;

  @IsInt()
  @Min(0)
  @Max(1)
  starting11: number;

  @IsInt()
  @Min(0)
  @Max(1)
  substitute: number;

  @IsInt()
  @Min(0)
  blockedshot: number;

  @IsInt()
  @Min(0)
  interceptionwon: number;

  @IsInt()
  @Min(0)
  clearance: number;
}
