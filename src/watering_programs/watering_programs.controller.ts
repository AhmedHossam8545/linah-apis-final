import { Controller, Get, Post, Body, Param, Patch, Delete, Put } from '@nestjs/common';
import { Watering_programService } from './watering_programs.service';
import { CreateWatering_programDto } from './dto/create-watering_program.dto';
import { UpdateWatering_programDto } from './dto/update-watering_program.dto';

@Controller('watering_programs')
export class Watering_programController {
  constructor(private readonly service: Watering_programService) {}

  @Post()
  create(@Body() dto: CreateWatering_programDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateWatering_programDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
