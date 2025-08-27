import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pests_seasonService } from './pests_seasons.service';
import { Pests_seasonController } from './pests_seasons.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])], // Using DataSource directly
  controllers: [Pests_seasonController],
  providers: [Pests_seasonService],
  exports: [Pests_seasonService],
})
export class Pests_seasonModule {}