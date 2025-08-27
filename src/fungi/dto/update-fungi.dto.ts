import { PartialType } from '@nestjs/mapped-types';
import { CreateFungiDto } from './create-fungi.dto';

export class UpdateFungiDto extends PartialType(CreateFungiDto) {}