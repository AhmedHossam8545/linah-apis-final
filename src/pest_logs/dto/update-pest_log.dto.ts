import { PartialType } from '@nestjs/mapped-types';
import { CreatePest_logDto } from './create-pest_log.dto';

export class UpdatePest_logDto extends PartialType(CreatePest_logDto) {}