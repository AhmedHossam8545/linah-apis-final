import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Watering_logService } from './watering_logs.service';
import { Watering_logController } from './watering_logs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])], // Using DataSource directly
  controllers: [Watering_logController],
  providers: [Watering_logService],
  exports: [Watering_logService],
})
export class Watering_logModule {}