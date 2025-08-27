import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Watering_shiftService } from './watering_shifts.service';
import { Watering_shiftController } from './watering_shifts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])], // Using DataSource directly
  controllers: [Watering_shiftController],
  providers: [Watering_shiftService],
  exports: [Watering_shiftService],
})
export class Watering_shiftModule {}