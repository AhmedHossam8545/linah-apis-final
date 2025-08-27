import { Controller, Get, Post, Body, Param, Patch, Delete, Put } from '@nestjs/common';
import { Pests_seasonService } from './pests_seasons.service';
import { CreatePests_seasonDto } from './dto/create-pests_season.dto';
import { UpdatePests_seasonDto } from './dto/update-pests_season.dto';

@Controller('pests_seasons')
export class Pests_seasonController {
  constructor(private readonly service: Pests_seasonService) {}

  @Post()
  create(@Body() dto: CreatePests_seasonDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdatePests_seasonDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
