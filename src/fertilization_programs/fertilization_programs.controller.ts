import { Controller, Get, Post, Body, Param, Patch, Delete, Put } from '@nestjs/common';
import { Fertilization_programService } from './fertilization_programs.service';
import { CreateFertilization_programDto } from './dto/create-fertilization_program.dto';
import { UpdateFertilization_programDto } from './dto/update-fertilization_program.dto';

@Controller('fertilization_programs')
export class Fertilization_programController {
  constructor(private readonly service: Fertilization_programService) {}

  @Post()
  create(@Body() dto: CreateFertilization_programDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateFertilization_programDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
