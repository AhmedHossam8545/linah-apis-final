import { Controller, Get, Post, Body, Param, Patch, Delete, Put } from '@nestjs/common';
import { CapturedInsectService } from './captured_insects.service';
import { CreateCaptured_insectDto } from './dto/create-captured_insect.dto';
import { UpdateCaptured_insectDto } from './dto/update-captured_insect.dto';

@Controller('captured_insects')
export class CapturedInsectController {
  constructor(private readonly service: CapturedInsectService) {}

  @Post()
  create(@Body() dto: CreateCaptured_insectDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateCaptured_insectDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
