import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rodent_traps_logService } from './rodent_traps_logs.service';
import { Rodent_traps_logController } from './rodent_traps_logs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])], // Using DataSource directly
  controllers: [Rodent_traps_logController],
  providers: [Rodent_traps_logService],
  exports: [Rodent_traps_logService],
})
export class Rodent_traps_logModule {}