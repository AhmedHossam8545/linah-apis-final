import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EngineerService } from './engineers.service';
import { EngineerController } from './engineers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])], // Using DataSource directly
  controllers: [EngineerController],
  providers: [EngineerService],
  exports: [EngineerService],
})
export class EngineerModule {}