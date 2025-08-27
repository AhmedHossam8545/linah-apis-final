import { Controller, Get, Post, Body, Param, Patch, Delete, Put } from '@nestjs/common';
import { Weather_logService } from './weather_logs.service';
import { CreateWeather_logDto } from './dto/create-weather_log.dto';
import { UpdateWeather_logDto } from './dto/update-weather_log.dto';

@Controller('weather_logs')
export class Weather_logController {
  constructor(private readonly service: Weather_logService) {}

  @Post()
  create(@Body() dto: CreateWeather_logDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateWeather_logDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
