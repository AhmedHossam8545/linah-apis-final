import { Controller, Get, Post, Body, Param, Patch, Delete, Put } from '@nestjs/common';
import { Watering_shiftService } from './watering_shifts.service';
import { CreateWatering_shiftDto } from './dto/create-watering_shift.dto';
import { UpdateWatering_shiftDto } from './dto/update-watering_shift.dto';

@Controller('watering_shifts')
export class Watering_shiftController {
  constructor(private readonly service: Watering_shiftService) {}

  @Post()
  create(@Body() dto: CreateWatering_shiftDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateWatering_shiftDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
