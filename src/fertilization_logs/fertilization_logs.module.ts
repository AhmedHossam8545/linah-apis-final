import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fertilization_logService } from './fertilization_logs.service';
import { Fertilization_logController } from './fertilization_logs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])], // Using DataSource directly
  controllers: [Fertilization_logController],
  providers: [Fertilization_logService],
  exports: [Fertilization_logService],
})
export class Fertilization_logModule {}