import { PartialType } from '@nestjs/mapped-types';
import { CreatePesticides_logDto } from './create-pesticides_log.dto';

export class UpdatePesticides_logDto extends PartialType(CreatePesticides_logDto) {}