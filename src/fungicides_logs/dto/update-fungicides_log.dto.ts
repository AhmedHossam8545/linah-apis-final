import { PartialType } from '@nestjs/mapped-types';
import { CreateFungicides_logDto } from './create-fungicides_log.dto';

export class UpdateFungicides_logDto extends PartialType(CreateFungicides_logDto) {}