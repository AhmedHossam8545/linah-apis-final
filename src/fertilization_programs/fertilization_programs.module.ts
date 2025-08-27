import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fertilization_programService } from './fertilization_programs.service';
import { Fertilization_programController } from './fertilization_programs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])], // Using DataSource directly
  controllers: [Fertilization_programController],
  providers: [Fertilization_programService],
  exports: [Fertilization_programService],
})
export class Fertilization_programModule {}