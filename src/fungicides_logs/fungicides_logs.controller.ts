import { Controller, Get, Post, Body, Param, Patch, Delete, Put } from '@nestjs/common';
import { Fungicides_logService } from './fungicides_logs.service';
import { CreateFungicides_logDto } from './dto/create-fungicides_log.dto';
import { UpdateFungicides_logDto } from './dto/update-fungicides_log.dto';

@Controller('fungicides_logs')
export class Fungicides_logController {
  constructor(private readonly service: Fungicides_logService) {}

  @Post()
  create(@Body() dto: CreateFungicides_logDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateFungicides_logDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
