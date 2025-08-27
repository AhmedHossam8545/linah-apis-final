import { PartialType } from '@nestjs/mapped-types';
import { CreateInsect_trapDto } from './create-insect_trap.dto';

export class UpdateInsect_trapDto extends PartialType(CreateInsect_trapDto) {}