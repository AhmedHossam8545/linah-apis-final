import { PartialType } from '@nestjs/mapped-types';
import { CreateWatering_programDto } from './create-watering_program.dto';

export class UpdateWatering_programDto extends PartialType(CreateWatering_programDto) {}