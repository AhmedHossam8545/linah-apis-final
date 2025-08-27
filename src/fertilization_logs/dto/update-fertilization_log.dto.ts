import { PartialType } from '@nestjs/mapped-types';
import { CreateFertilization_logDto } from './create-fertilization_log.dto';

export class UpdateFertilization_logDto extends PartialType(CreateFertilization_logDto) {}