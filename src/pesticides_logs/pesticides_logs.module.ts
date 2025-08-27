import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pesticides_logService } from './pesticides_logs.service';
import { Pesticides_logController } from './pesticides_logs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])], // Using DataSource directly
  controllers: [Pesticides_logController],
  providers: [Pesticides_logService],
  exports: [Pesticides_logService],
})
export class Pesticides_logModule {}