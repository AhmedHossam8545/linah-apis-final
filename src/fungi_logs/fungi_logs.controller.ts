import { Controller, Get, Post, Body, Param, Patch, Delete, Put } from '@nestjs/common';
import { Fungi_logService } from './fungi_logs.service';
import { CreateFungi_logDto } from './dto/create-fungi_log.dto';
import { UpdateFungi_logDto } from './dto/update-fungi_log.dto';

@Controller('fungi_logs')
export class Fungi_logController {
  constructor(private readonly service: Fungi_logService) {}

  @Post()
  create(@Body() dto: CreateFungi_logDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateFungi_logDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
