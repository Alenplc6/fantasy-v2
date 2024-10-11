import { PartialType } from '@nestjs/swagger';
import { CreateFantasyPointDto } from './create-fantasy-point.dto';

export class UpdateFantasyPointDto extends PartialType(CreateFantasyPointDto) {}
