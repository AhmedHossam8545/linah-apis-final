import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Watering_programService } from './watering_programs.service';
import { Watering_programController } from './watering_programs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])], // Using DataSource directly
  controllers: [Watering_programController],
  providers: [Watering_programService],
  exports: [Watering_programService],
})
export class Watering_programModule {}