import { Controller, Get, Post, Body, Param, Patch, Delete, Put } from '@nestjs/common';
import { FungiService } from './fungi.service';
import { CreateFungiDto } from './dto/create-fungi.dto';
import { UpdateFungiDto } from './dto/update-fungi.dto';

@Controller('fungi')
export class FungiController {
  constructor(private readonly service: FungiService) {}

  @Post()
  create(@Body() dto: CreateFungiDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateFungiDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
