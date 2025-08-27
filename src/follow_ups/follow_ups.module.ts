import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow_upService } from './follow_ups.service';
import { Follow_upController } from './follow_ups.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])], // Using DataSource directly
  controllers: [Follow_upController],
  providers: [Follow_upService],
  exports: [Follow_upService],
})
export class Follow_upModule {}