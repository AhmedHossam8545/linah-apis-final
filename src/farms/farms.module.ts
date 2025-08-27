import { Module } from '@nestjs/common';
import { FarmsService } from './farms.service';
import { FarmsController } from './farms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([])], // we use DataSource directly
  controllers: [FarmsController],
  providers: [FarmsService],
})
export class FarmsModule {}
