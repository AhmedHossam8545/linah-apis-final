import { Controller, Get, Post, Body, Param, Patch, Delete, Put } from '@nestjs/common';
import { Insect_trapService } from './insect_traps.service';
import { CreateInsect_trapDto } from './dto/create-insect_trap.dto';
import { UpdateInsect_trapDto } from './dto/update-insect_trap.dto';

@Controller('insect_traps')
export class Insect_trapController {
  constructor(private readonly service: Insect_trapService) {}

  @Post()
  create(@Body() dto: CreateInsect_trapDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateInsect_trapDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
