import { PartialType } from '@nestjs/mapped-types';
import { CreateFungi_logDto } from './create-fungi_log.dto';

export class UpdateFungi_logDto extends PartialType(CreateFungi_logDto) {}