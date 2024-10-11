import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Role } from 'src/user/entities/role.enum';

export class CreateAuthDto {
  @IsString()
  @ApiProperty({ type: String, description: 'fullName' })
  fullName: string;
  @IsEnum(['Male', 'Female'], {
    message: 'Gender has to be one of the following Male or Female',
  })
  @ApiProperty({ type: String, description: 'gender' })
  gender: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: 'phone' })
  phone: string;
  @IsString()
  @ApiProperty({ type: String, description: 'password' })
  password: string;
  @IsEnum(['admin', 'user', 'guest'], {
    message: 'Role has to be one of the following admin, user, guest',
  })
  @ApiProperty({ type: String, description: 'role' })
  role: Role;
}

export class CreateSignInDto {
  @IsString()
  @ApiProperty({ type: String, description: 'phone' })
  phone: string;
  @IsString()
  @ApiProperty({ type: String, description: 'password' })
  password: string;
}

export class UpdatePasswordDto {
  @IsString()
  @ApiProperty({ type: String, description: 'oldPassword' })
  oldPassword: string;
  @IsString()
  @ApiProperty({ type: String, description: 'newPassword' })
  newPassword: string;
  @IsString()
  @Matches('newPassword')
  @ApiProperty({ type: String, description: 'conformPassword' })
  conformPassword: string;
}

export class CreateTeamDto {
  @IsString()
  @ApiProperty({ type: String, description: 'teamName' })
  teamName: string;

  @IsString()
  @ApiProperty({ type: String, description: 'coachName' })
  coachName: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsOptional()
  @ApiProperty({ type: Array, description: 'goalKeeper' })
  goalKeeper: [string];

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(5)
  @IsOptional()
  @ApiProperty({ type: Array, description: 'defense' })
  defense: [string];

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(5)
  @IsOptional()
  @ApiProperty({ type: Array, description: 'midFielder' })
  midFielder: [string];

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(4)
  @IsOptional()
  @ApiProperty({ type: Array, description: 'offense' })
  offense: [string];

  @IsString()
  @ApiProperty({ type: String, description: 'formation' })
  formation: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(4)
  @ApiProperty({ type: Array, description: 'capitan' })
  capitan: [string];
}
