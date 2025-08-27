import { Controller, Get, Post, Body, Param, Patch, Delete, Put } from '@nestjs/common';
import { Fertilization_logService } from './fertilization_logs.service';
import { CreateFertilization_logDto } from './dto/create-fertilization_log.dto';
import { UpdateFertilization_logDto } from './dto/update-fertilization_log.dto';

@Controller('fertilization_logs')
export class Fertilization_logController {
  constructor(private readonly service: Fertilization_logService) {}

  @Post()
  create(@Body() dto: CreateFertilization_logDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateFertilization_logDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
