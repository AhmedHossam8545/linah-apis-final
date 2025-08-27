import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fungicides_logService } from './fungicides_logs.service';
import { Fungicides_logController } from './fungicides_logs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])], // Using DataSource directly
  controllers: [Fungicides_logController],
  providers: [Fungicides_logService],
  exports: [Fungicides_logService],
})
export class Fungicides_logModule {}