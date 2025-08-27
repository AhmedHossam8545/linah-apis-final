import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CropService } from './crops.service';
import { CropController } from './crops.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])], // Using DataSource directly
  controllers: [CropController],
  providers: [CropService],
  exports: [CropService],
})
export class CropModule {}