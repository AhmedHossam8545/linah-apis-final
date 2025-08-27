import { Controller, Get, Post, Body, Param, Patch, Delete, Put } from '@nestjs/common';
import { Rodent_trapService } from './rodent_traps.service';
import { CreateRodent_trapDto } from './dto/create-rodent_trap.dto';
import { UpdateRodent_trapDto } from './dto/update-rodent_trap.dto';

@Controller('rodent_traps')
export class Rodent_trapController {
  constructor(private readonly service: Rodent_trapService) {}

  @Post()
  create(@Body() dto: CreateRodent_trapDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateRodent_trapDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
