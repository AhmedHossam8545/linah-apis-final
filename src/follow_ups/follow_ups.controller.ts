import { Controller, Get, Post, Body, Param, Patch, Delete, Put } from '@nestjs/common';
import { Follow_upService } from './follow_ups.service';
import { CreateFollow_upDto } from './dto/create-follow_up.dto';
import { UpdateFollow_upDto } from './dto/update-follow_up.dto';

@Controller('follow_ups')
export class Follow_upController {
  constructor(private readonly service: Follow_upService) {}

  @Post()
  create(@Body() dto: CreateFollow_upDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateFollow_upDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
