import { PartialType } from '@nestjs/mapped-types';
import { CreateFertilization_shiftDto } from './create-fertilization_shift.dto';

export class UpdateFertilization_shiftDto extends PartialType(CreateFertilization_shiftDto) {}