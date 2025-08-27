import { Controller, Get, Post, Body, Param, Patch, Delete, Put } from '@nestjs/common';
import { FarmsService } from './farms.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';

@Controller('farms')
export class FarmsController {
  constructor(private readonly farms: FarmsService) {}

  @Post()
  create(@Body() dto: CreateFarmDto) {
    return this.farms.create(dto);
  }

  @Get()
  findAll() {
    return this.farms.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.farms.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFarmDto) {
    return this.farms.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.farms.remove(id);
  }
}
