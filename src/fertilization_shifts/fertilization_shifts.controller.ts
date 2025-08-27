import { Controller, Get, Post, Body, Param, Patch, Delete, Put } from '@nestjs/common';
import { Fertilization_shiftService } from './fertilization_shifts.service';
import { CreateFertilization_shiftDto } from './dto/create-fertilization_shift.dto';
import { UpdateFertilization_shiftDto } from './dto/update-fertilization_shift.dto';

@Controller('fertilization_shifts')
export class Fertilization_shiftController {
  constructor(private readonly service: Fertilization_shiftService) {}

  @Post()
  create(@Body() dto: CreateFertilization_shiftDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateFertilization_shiftDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
