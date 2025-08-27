import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Insect_trapService } from './insect_traps.service';
import { Insect_trapController } from './insect_traps.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])], // Using DataSource directly
  controllers: [Insect_trapController],
  providers: [Insect_trapService],
  exports: [Insect_trapService],
})
export class Insect_trapModule {}