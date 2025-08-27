import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiseaseService } from './diseases.service';
import { DiseaseController } from './diseases.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])], // Using DataSource directly
  controllers: [DiseaseController],
  providers: [DiseaseService],
  exports: [DiseaseService],
})
export class DiseaseModule {}