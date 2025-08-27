import { PartialType } from '@nestjs/mapped-types';
import { CreateCaptured_insectDto } from './create-captured_insect.dto';

export class UpdateCaptured_insectDto extends PartialType(CreateCaptured_insectDto) {}