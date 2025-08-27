import { PartialType } from '@nestjs/mapped-types';
import { CreateFertilization_programDto } from './create-fertilization_program.dto';

export class UpdateFertilization_programDto extends PartialType(CreateFertilization_programDto) {}