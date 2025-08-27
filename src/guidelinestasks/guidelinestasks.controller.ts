import { Controller, Get, Post, Body, Param, Patch, Delete, Put } from '@nestjs/common';
import { GuidelinesTaskService } from './guidelinestasks.service';
import { CreateGuidelinesTaskDto } from './dto/create-guidelinestask.dto';
import { UpdateGuidelinesTaskDto } from './dto/update-guidelinestask.dto';

@Controller('guidelinestasks')
export class GuidelinesTaskController {
  constructor(private readonly service: GuidelinesTaskService) {}

  @Post()
  create(@Body() dto: CreateGuidelinesTaskDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateGuidelinesTaskDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
