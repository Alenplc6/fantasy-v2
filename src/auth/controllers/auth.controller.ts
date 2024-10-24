import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import {
  CreateSignInDto,
  CreateTeamDto,
  UpdatePasswordDto,
} from '../dto/create-auth.dto';
import { User } from 'src/user/entities/user.entity';
import { GetUser } from '../decorators/get.user.decorator';
import { JwtGuard } from '../guards/jwt.guard';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

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
  login(@Body() createSignInDto: CreateSignInDto) {
    return this.authService.signIn(createSignInDto);
  }

  @Post('/create-team/:id')
  createTeam(@Param('id') id: string, @Body() createTeamDto: CreateTeamDto) {
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
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  profile(@GetUser() user: User) {
    return user;
  }

  @Patch('update-profile')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  updateProfile(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateProfile(user, updateUserDto);
  }
}
