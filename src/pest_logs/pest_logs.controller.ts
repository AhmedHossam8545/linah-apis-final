import { Controller, Get, Post, Body, Param, Patch, Delete, Put } from '@nestjs/common';
import { Pest_logService } from './pest_logs.service';
import { CreatePest_logDto } from './dto/create-pest_log.dto';
import { UpdatePest_logDto } from './dto/update-pest_log.dto';

@Controller('pest_logs')
export class Pest_logController {
  constructor(private readonly service: Pest_logService) {}

  @Post()
  create(@Body() dto: CreatePest_logDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdatePest_logDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
