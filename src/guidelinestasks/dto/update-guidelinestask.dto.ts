import { PartialType } from '@nestjs/mapped-types';
import { CreateGuidelinesTaskDto } from './create-guidelinestask.dto';

export class UpdateGuidelinesTaskDto extends PartialType(CreateGuidelinesTaskDto) {}