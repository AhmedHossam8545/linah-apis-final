import { PartialType } from '@nestjs/mapped-types';
import { CreateFollow_upDto } from './create-follow_up.dto';

export class UpdateFollow_upDto extends PartialType(CreateFollow_upDto) {}