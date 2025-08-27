import { PartialType } from '@nestjs/mapped-types';
import { CreateRodent_traps_logDto } from './create-rodent_traps_log.dto';

export class UpdateRodent_traps_logDto extends PartialType(CreateRodent_traps_logDto) {}