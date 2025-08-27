import { Controller, Get, Post, Body, Param, Patch, Delete, Put } from '@nestjs/common';
import { EngineerService } from './engineers.service';
import { CreateEngineerDto } from './dto/create-engineer.dto';
import { UpdateEngineerDto } from './dto/update-engineer.dto';

@Controller('engineers')
export class EngineerController {
  constructor(private readonly service: EngineerService) {}

  @Post()
  create(@Body() dto: CreateEngineerDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateEngineerDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
