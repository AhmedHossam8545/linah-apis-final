import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Insect_traps_logService } from './insect_traps_logs.service';
import { Insect_traps_logController } from './insect_traps_logs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])], // Using DataSource directly
  controllers: [Insect_traps_logController],
  providers: [Insect_traps_logService],
  exports: [Insect_traps_logService],
})
export class Insect_traps_logModule {}