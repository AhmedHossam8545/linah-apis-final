import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PestService } from './pests.service';
import { PestController } from './pests.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])], // Using DataSource directly
  controllers: [PestController],
  providers: [PestService],
  exports: [PestService],
})
export class PestModule {}