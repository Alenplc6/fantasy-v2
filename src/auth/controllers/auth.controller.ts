import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { Role } from 'src/user/entities/role.enum';
import { User } from 'src/user/entities/user.entity';
import { GetUser } from '../decorators/get.user.decorator';
import { Roles } from '../decorators/roles.decorator';
import {
  CreateNewTeamDto,
  CreateSignInDto,
  CreateSubstitutionDto,
  UpdatePasswordDto,
  UpdateSettingDto,
} from '../dto/create-auth.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { AuthService } from '../services/auth.service';
@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('/login')
  @UseGuards()
  login(@Body() createSignInDto: CreateSignInDto) {
    return this.authService.signIn(createSignInDto);
  }

  @Get('my-team/:id')
  myTeam(@Param('id') id: number) {
    return this.authService.myTeam(id);
  }

  @Get('my-bench/:id')
  benchPlayers(@Param('id') id: number) {
    return this.authService.benchPlayers(id);
  }

  @Patch('/create-team/:id')
  createTeam(@Param('id') id: string, @Body() createTeamDto: CreateNewTeamDto) {
    return this.authService.createTeam(id, createTeamDto);
  }

  @Post('update-password')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  updatePassword(
    @GetUser() user: User,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.authService.updatePassword(user, updatePasswordDto);
  }

  @Get('/profile')
  @UseGuards(JwtGuard)
  @Roles(Role.ADMIN, Role.USER)
  profile(@GetUser() user: User, @Req() req: Request) {
    console.log(req);
    return user;
  }

  @Patch('update-profile')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  updateProfile(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateProfile(user, updateUserDto);
  }

  @Patch('update-setting')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  updateSettings(
    @GetUser() user: User,
    @Body() updateUserDto: UpdateSettingDto,
  ) {
    return this.authService.updateSetting(user, updateUserDto);
  }

  @Patch('substitution')
  // @ApiBearerAuth()
  // @UseGuards(JwtGuard)
  substitution(
    // @GetUser() user: User,
    @Body() updateUserDto: CreateSubstitutionDto,
  ) {
    return this.authService.substitution(updateUserDto);
  }
}
