import { PartialType } from '@nestjs/mapped-types';
import { CreatePests_seasonDto } from './create-pests_season.dto';

export class UpdatePests_seasonDto extends PartialType(CreatePests_seasonDto) {}