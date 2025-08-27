import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rodent_trapService } from './rodent_traps.service';
import { Rodent_trapController } from './rodent_traps.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])], // Using DataSource directly
  controllers: [Rodent_trapController],
  providers: [Rodent_trapService],
  exports: [Rodent_trapService],
})
export class Rodent_trapModule {}