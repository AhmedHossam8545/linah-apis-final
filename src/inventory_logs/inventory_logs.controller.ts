import { Controller, Get, Post, Body, Param, Patch, Delete, Put } from '@nestjs/common';
import { Inventory_logService } from './inventory_logs.service';
import { CreateInventory_logDto } from './dto/create-inventory_log.dto';
import { UpdateInventory_logDto } from './dto/update-inventory_log.dto';

@Controller('inventory_logs')
export class Inventory_logController {
  constructor(private readonly service: Inventory_logService) {}

  @Post()
  create(@Body() dto: CreateInventory_logDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInventory_logDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
