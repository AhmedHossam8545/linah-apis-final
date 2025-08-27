import { Controller, Get, Post, Body, Param, Patch, Delete, Put } from '@nestjs/common';
import { Pesticides_logService } from './pesticides_logs.service';
import { CreatePesticides_logDto } from './dto/create-pesticides_log.dto';
import { UpdatePesticides_logDto } from './dto/update-pesticides_log.dto';

@Controller('pesticides_logs')
export class Pesticides_logController {
  constructor(private readonly service: Pesticides_logService) {}

  @Post()
  create(@Body() dto: CreatePesticides_logDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdatePesticides_logDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
