import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/services/user.service';
import {
  CreateAuthDto,
  CreateSignInDto,
  CreateTeamDto,
  UpdatePasswordDto,
} from '../dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

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
      const token = await this.jwtService.signAsync({ user });
      return {
        user,
        token,
      };
    }
  }

  async updatePassword(user: User, updatePasswordDto: UpdatePasswordDto) {
    return await this.userService.updatePassword(user, updatePasswordDto);
  }

  async createTeam(id: string, createTeamDto: CreateTeamDto) {
    return await this.userService.createTeam(+id, createTeamDto);
  }

  async updateProfile(user: User, updateUserDto: UpdateUserDto) {
    return await this.userService.updateProfile(user, updateUserDto);
  }
}
