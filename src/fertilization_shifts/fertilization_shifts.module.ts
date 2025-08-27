import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fertilization_shiftService } from './fertilization_shifts.service';
import { Fertilization_shiftController } from './fertilization_shifts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])], // Using DataSource directly
  controllers: [Fertilization_shiftController],
  providers: [Fertilization_shiftService],
  exports: [Fertilization_shiftService],
})
export class Fertilization_shiftModule {}