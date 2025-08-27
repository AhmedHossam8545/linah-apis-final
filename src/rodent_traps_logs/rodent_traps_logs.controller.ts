import { Controller, Get, Post, Body, Param, Patch, Delete, Put } from '@nestjs/common';
import { Rodent_traps_logService } from './rodent_traps_logs.service';
import { CreateRodent_traps_logDto } from './dto/create-rodent_traps_log.dto';
import { UpdateRodent_traps_logDto } from './dto/update-rodent_traps_log.dto';

@Controller('rodent_traps_logs')
export class Rodent_traps_logController {
  constructor(private readonly service: Rodent_traps_logService) {}

  @Post()
  create(@Body() dto: CreateRodent_traps_logDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateRodent_traps_logDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
