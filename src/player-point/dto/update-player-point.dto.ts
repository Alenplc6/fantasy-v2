import { PartialType } from '@nestjs/swagger';
import { CreatePlayerPointDto } from './create-player-point.dto';

export class UpdatePlayerPointDto extends PartialType(CreatePlayerPointDto) {}
