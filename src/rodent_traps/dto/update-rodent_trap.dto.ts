import { PartialType } from '@nestjs/mapped-types';
import { CreateRodent_trapDto } from './create-rodent_trap.dto';

export class UpdateRodent_trapDto extends PartialType(CreateRodent_trapDto) {}