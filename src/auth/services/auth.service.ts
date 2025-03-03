import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import {
  CreateAuthDto,
  CreateNewTeamDto,
  CreateSignInDto,
  CreateSubstitutionDto,
  UpdatePasswordDto,
  UpdateSettingDto,
} from '../dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  //register
  async register(createAuthDto: CreateAuthDto) {
    return await this.userService.create(createAuthDto);
  }
  // signin
  async signIn(loginUser: CreateSignInDto): Promise<any> {
    const { phone, password } = loginUser;

    const user = await this.userService.validateUser(phone, password);

    if (user) {
      // create JWT - credentials
      const token = await this.jwtService.signAsync({
        id: user.id,
        name: user.fullName,
      });
      return {
        user,
        token,
      };
    }
  }

  async updatePassword(user: User, updatePasswordDto: UpdatePasswordDto) {
    return await this.userService.updatePassword(user, updatePasswordDto);
  }

  async createTeam(id: string, createTeamDto: CreateNewTeamDto) {
    return await this.userService.createTeam(+id, createTeamDto);
  }

  async updateProfile(user: User, updateUserDto: UpdateUserDto) {
    return await this.userService.updateProfile(user, updateUserDto);
  }

  async updateSetting(user: User, updateUserDto: UpdateSettingDto) {
    return await this.userService.updateSetting(user, updateUserDto);
  }

  async substitution(updateUserDto: CreateSubstitutionDto) {
    const { oldPlayerId, newPlayerId } = updateUserDto;
    return await this.userService.substitution({
      oldPlayerId,
      newPlayerId,
    });
  }

  async myTeam(id: number) {
    return await this.userService.myTeam(id);
  }

  async benchPlayers(id: number) {
    return await this.userService.benchPlayers(id);
  }
}
