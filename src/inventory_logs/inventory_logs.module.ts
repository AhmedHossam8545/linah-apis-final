import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory_logService } from './inventory_logs.service';
import { Inventory_logController } from './inventory_logs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])], // Using DataSource directly
  controllers: [Inventory_logController],
  providers: [Inventory_logService],
  exports: [Inventory_logService],
})
export class Inventory_logModule {}