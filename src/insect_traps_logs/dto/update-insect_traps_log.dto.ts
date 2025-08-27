import { PartialType } from '@nestjs/mapped-types';
import { CreateInsect_traps_logDto } from './create-insect_traps_log.dto';

export class UpdateInsect_traps_logDto extends PartialType(CreateInsect_traps_logDto) {}