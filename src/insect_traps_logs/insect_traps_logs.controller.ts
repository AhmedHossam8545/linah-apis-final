import { Controller, Get, Post, Body, Param, Patch, Delete, Put } from '@nestjs/common';
import { Insect_traps_logService } from './insect_traps_logs.service';
import { CreateInsect_traps_logDto } from './dto/create-insect_traps_log.dto';
import { UpdateInsect_traps_logDto } from './dto/update-insect_traps_log.dto';

@Controller('insect_traps_logs')
export class Insect_traps_logController {
  constructor(private readonly service: Insect_traps_logService) {}

  @Post()
  create(@Body() dto: CreateInsect_traps_logDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateInsect_traps_logDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
