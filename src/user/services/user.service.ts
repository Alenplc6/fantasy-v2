import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { UpdateSettingDto } from 'src/auth/dto/create-auth.dto';
import { Formation } from 'src/formation/entities/formation.entity';
import { Player } from 'src/player/entities/player.entity';
import { ILike, Repository } from 'typeorm';
import {
  CreateTeamDto,
  CreateUserDto,
  UpdatePasswordDto,
} from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { TeamPlayer } from '../entities/team.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(TeamPlayer)
    private readonly teamPlayerRepository: Repository<TeamPlayer>,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    @InjectRepository(Formation)
    private readonly formationRepository: Repository<Formation>,
  ) {}

  // helper methods
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  async dosePhoneNumberExist(phone: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: {
        phone: phone,
      },
    });
    if (user) return true;
    else return false;
  }

  async validateUser(phone: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { phone } });

    //check if the user exist
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Invalid phone number or pin',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const { password } = createUserDto;

    // const doseUserExist: boolean = await this.dosePhoneNumberExist(phone);

    // if (doseUserExist)
    //   throw new HttpException(
    //     'Phone number has been already registered',
    //     HttpStatus.BAD_REQUEST,
    //   );

    const user = this.userRepository.create({
      ...createUserDto,
      password: await this.hashPassword(password),
    });
    await this.userRepository.save(user);

    return user;
  }

  async findAll(q: string, pageSize: number, page: number) {
    // return await this.userRepository.find();
    const [data, total] = await this.userRepository.findAndCount({
      where: { fullName: ILike(`%${q}%`) },
      skip: (page - 1) * pageSize, // calculate the offset
      take: pageSize, // limit the number of results
      order: {
        // Sort results, e.g., by `id` column
        id: 'ASC',
      },
    });

    return {
      data, // paginated data
      total, // total number of records
      currentPage: page,
      pageSize,
    };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('user dose not exist', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('user dose not exist', HttpStatus.BAD_REQUEST);
    }
    return await this.userRepository.update(id, {
      ...updateUserDto,
    });
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('user dose not exist', HttpStatus.BAD_REQUEST);
    }
    await this.userRepository.delete(id);
    return { message: 'User removed successfully' };
  }

  // password update
  async updatePassword(
    user: User,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<any> {
    // distract the update password dto
    const { oldPassword, newPassword } = updatePasswordDto;

    // get the user id
    const { id } = user;

    // check the id
    const existingUser = await this.userRepository.findOne({ where: { id } });

    //check if the old password is correct
    if (!existingUser && bcrypt.compare(oldPassword, existingUser.password)) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'User Was Not Found',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    //hashing the password
    const hashedPassword = await this.hashPassword(newPassword);

    return await this.userRepository.update(id, {
      password: hashedPassword,
    });
  }

  async createTeam(id: number, createTeamDto: CreateTeamDto) {
    const {
      teamName,
      coachName,
      formation,
      goalKeeper,
      defense,
      midFielder,
      offense,
      // capitan,
    } = createTeamDto;
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('user dose not exist', HttpStatus.BAD_REQUEST);
    }

    const formationData = await this.formationRepository.findOne({
      where: { id: formation },
    });
    if (!formationData) {
      throw new HttpException(
        'formation dose not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    console.log(formationData);

    await this.userRepository.update(id, {
      teamName,
      coachName,
      formation: formationData,
      isTeamCreated: true,
    });

    goalKeeper.map(async (goal: string) => {
      const teamPlayer = new TeamPlayer();
      const player = await this.playerRepository.findOneBy({ id: +goal });
      teamPlayer.pid = player.pid;
      teamPlayer.player = player; // Assign the Player entity
      teamPlayer.user = user; // Assign the User entity
      teamPlayer.position = 'goalKeeper';
      teamPlayer.isCapitan = false;
      await this.teamPlayerRepository.save(teamPlayer);
    });

    defense.map(async (def: string) => {
      const teamPlayer = new TeamPlayer();

      const player = await this.playerRepository.findOneBy({ id: +def });

      teamPlayer.pid = player.pid;
      teamPlayer.player = player; // Assign the Player entity
      teamPlayer.user = user; // Assign the User entity
      teamPlayer.position = 'defense';
      teamPlayer.isCapitan = false;
      await this.teamPlayerRepository.save(teamPlayer);
    });

    midFielder.map(async (mid: string) => {
      const teamPlayer = new TeamPlayer();

      const player = await this.playerRepository.findOneBy({ id: +mid });

      teamPlayer.pid = player.pid;
      teamPlayer.player = player; // Assign the Player entity
      teamPlayer.user = user; // Assign the User entity
      teamPlayer.position = 'midFielder';
      teamPlayer.isCapitan = false;
      await this.teamPlayerRepository.save(teamPlayer);
    });

    offense.map(async (off: string) => {
      const teamPlayer = new TeamPlayer();

      const player = await this.playerRepository.findOneBy({ id: +off });

      teamPlayer.pid = player.pid;
      teamPlayer.player = player; // Assign the Player entity
      teamPlayer.user = user; // Assign the User entity
      teamPlayer.position = 'offense';
      teamPlayer.isCapitan = false;
      await this.teamPlayerRepository.save(teamPlayer);
    });

    return user;
  }

  async updateProfile(userData: User, updateUserDto: UpdateUserDto) {
    const { id } = userData;
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('user dose not exist', HttpStatus.BAD_REQUEST);
    }

    return await this.userRepository.update(id, {
      ...updateUserDto,
    });
  }

  async updateSetting(userData: User, updateUserDto: UpdateSettingDto) {
    const { id } = userData;
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('user dose not exist', HttpStatus.BAD_REQUEST);
    }

    const formation = await this.formationRepository.findOne({
      where: { id: updateUserDto.formation },
    });
    if (!formation) {
      throw new HttpException(
        'formation dose not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.userRepository.update(id, {
      ...updateUserDto,
      formation,
    });
  }

  async substitution(
    user: User,
    substitutionDto: { oldPlayerId: number; newPlayerId: number },
  ) {
    const newPlayer = await this.teamPlayerRepository.findOneBy({
      playerId: substitutionDto.newPlayerId,
    });

    if (!newPlayer) {
      throw new HttpException('Player dose not exist', HttpStatus.BAD_REQUEST);
    }

    const oldPlayer = await this.teamPlayerRepository.findOneBy({
      id: substitutionDto.oldPlayerId,
    });

    if (!oldPlayer) {
      throw new HttpException('Player dose not exist', HttpStatus.BAD_REQUEST);
    }

    console.log(oldPlayer, newPlayer);
    // await this.teamPlayerRepository.remove(oldPlayer);
    await this.teamPlayerRepository.update(oldPlayer.id, {
      isOnTheBench: true,
    });

    await this.teamPlayerRepository.update(newPlayer.id, {
      isOnTheBench: false,
    });

    // const teamPlayer = new TeamPlayer();
    // teamPlayer.pid = newPlayer.pid;
    // teamPlayer.player = newPlayer; // Assign the Player entity
    // teamPlayer.user = user; // Assign the User entity
    // teamPlayer.position = newPlayer.positionName;
    // teamPlayer.isCapitan = false;
    // await this.teamPlayerRepository.save(teamPlayer);
  }

  async myTeam(id: number) {
    const { formation } = await this.userRepository.findOne({ where: { id } });
    const players = await this.teamPlayerRepository.findBy({ userId: id });

    const { defense, midfield, offense } = formation;

    const myTeam = [
      { name: 'Defense', players: [] },
      { name: 'Offense', players: [] },
      { name: 'Mid Field', players: [] },
      { name: 'Goal Keeper', players: [] },
    ];

    players.forEach((playerData: TeamPlayer) => {
      if (
        playerData.position === 'defense' &&
        myTeam[0].players.length < defense
      ) {
        myTeam[0].players.push({
          id: playerData.id,
          name: `${playerData.player.fullName}`,
        });
      } else if (
        playerData.position === 'offense' &&
        myTeam[1].players.length < offense
      ) {
        myTeam[1].players.push({
          id: playerData.id,
          name: `${playerData.player.fullName}`,
        });
      } else if (
        playerData.position === 'midFielder' &&
        myTeam[2].players.length < midfield
      ) {
        myTeam[2].players.push({
          id: playerData.id,
          name: `${playerData.player.fullName}`,
        });
      } else if (
        playerData.position === 'goalKeeper' &&
        myTeam[3].players.length < 1
      ) {
        myTeam[3].players.push({
          id: playerData.id,
          name: `${playerData.player.fullName}`,
        });
      }
    });

    return myTeam;
  }

  async benchPlayers(id: number) {
    const teamPlayers = await this.teamPlayerRepository
      .createQueryBuilder('teamPlayer')
      .leftJoinAndSelect('teamPlayer.player', 'player') // Join with Player entity
      .where({ userId: id })
      .select(['teamPlayer', 'player.fullName']) // Select only the teamPlayer and player.fullName
      .take(5)
      .getMany();

    return teamPlayers.map((teamPlayer) => {
      return {
        ...teamPlayer,
        name: teamPlayer.player.fullName, // Rename fullName to name
      };
    });
  }
}
