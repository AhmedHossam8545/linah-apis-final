import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WellService } from './wells.service';
import { WellController } from './wells.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])], // Using DataSource directly
  controllers: [WellController],
  providers: [WellService],
  exports: [WellService],
})
export class WellModule {}