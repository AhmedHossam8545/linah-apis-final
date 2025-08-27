import { PartialType } from '@nestjs/mapped-types';
import { CreateWatering_shiftDto } from './create-watering_shift.dto';

export class UpdateWatering_shiftDto extends PartialType(CreateWatering_shiftDto) {}