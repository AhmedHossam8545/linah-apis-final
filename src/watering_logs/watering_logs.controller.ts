import { Controller, Get, Post, Body, Param, Patch, Delete, Put } from '@nestjs/common';
import { Watering_logService } from './watering_logs.service';
import { CreateWatering_logDto } from './dto/create-watering_log.dto';
import { UpdateWatering_logDto } from './dto/update-watering_log.dto';

@Controller('watering_logs')
export class Watering_logController {
  constructor(private readonly service: Watering_logService) {}

  @Post()
  create(@Body() dto: CreateWatering_logDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateWatering_logDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
