import { PartialType } from '@nestjs/mapped-types';
import { CreateInventory_logDto } from './create-inventory_log.dto';

export class UpdateInventory_logDto extends PartialType(CreateInventory_logDto) {}