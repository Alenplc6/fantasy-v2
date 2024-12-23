import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from 'src/player/entities/player.entity';
import { User } from 'src/user/entities';
import { TeamPlayer } from 'src/user/entities/team.entity';
import { Repository } from 'typeorm';
import { CreateTransferDto, UpdateTransferDto } from '../dto';
import { Transfer } from '../entities/transfer.entity';

@Injectable()
export class TransferService {
  constructor(
    @InjectRepository(Transfer)
    private readonly transferRepository: Repository<Transfer>,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TeamPlayer)
    private readonly teamPlayerRepository: Repository<TeamPlayer>,
  ) {}

  async create(createTransferDto: CreateTransferDto): Promise<Transfer> {
    const { playerInId, playerOutId, userId } = createTransferDto;
    // Find related entities
    const playerIn = await this.playerRepository.findOneByOrFail({
      id: createTransferDto.playerInId,
    });
    const playerOut = await this.playerRepository.findOneByOrFail({
      id: createTransferDto.playerOutId,
    });
    const user = await this.userRepository.findOneByOrFail({
      id: createTransferDto.userId,
    });

    // Create a new transfer
    const transfer = this.transferRepository.create({
      gameWeek: createTransferDto.gameWeek,
      playerInId: playerIn,
      playerOutId: playerOut,
      user: user,
      transferType: createTransferDto.transferType,
      transferDate: new Date(),
    });

    // Save the transfer in the database
    await this.transferRepository.save(transfer);

    // delete from the team player list
    const deletedPlayer = await this.teamPlayerRepository.findOneBy({
      playerId: playerOutId,
      userId,
    });

    await this.teamPlayerRepository.delete({ playerId: playerOutId, userId });

    // create player
    // create the team player with the new player
    const player = await this.playerRepository.findOneBy({ id: +playerInId });
    if (player) {
      const teamPlayer = this.teamPlayerRepository.create({
        pid: player.pid,
        player,
        user,
        position: deletedPlayer.position,
        isCapitan: false,
        isOnTheBench: false, // Mark as on the bench if beyond starters count
      });
      await this.teamPlayerRepository.save(teamPlayer);
    }

    //
    return transfer;
  }

  async findAll(): Promise<Transfer[]> {
    return this.transferRepository.find({
      relations: ['playerIn', 'playerOut', 'user'],
    });
  }

  async findOne(id: string): Promise<Transfer> {
    const transfer = await this.transferRepository.findOne({
      where: { id },
      relations: ['playerIn', 'playerOut', 'user'],
    });
    if (!transfer) {
      throw new NotFoundException(`Transfer with ID ${id} not found`);
    }
    return transfer;
  }
  async update(
    id: string,
    updateTransferDto: UpdateTransferDto,
  ): Promise<Transfer> {
    const transfer = await this.findOne(id);
    Object.assign(transfer, updateTransferDto);
    return this.transferRepository.save(transfer);
  }

  async remove(id: string): Promise<void> {
    const transfer = await this.findOne(id);
    await this.transferRepository.remove(transfer);
  }
}
