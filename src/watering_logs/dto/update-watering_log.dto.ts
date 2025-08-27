import { PartialType } from '@nestjs/mapped-types';
import { CreateWatering_logDto } from './create-watering_log.dto';

export class UpdateWatering_logDto extends PartialType(CreateWatering_logDto) {}