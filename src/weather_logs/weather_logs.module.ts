import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Weather_logService } from './weather_logs.service';
import { Weather_logController } from './weather_logs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])], // Using DataSource directly
  controllers: [Weather_logController],
  providers: [Weather_logService],
  exports: [Weather_logService],
})
export class Weather_logModule {}