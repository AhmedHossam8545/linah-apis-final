import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuidelinesTaskService } from './guidelinestasks.service';
import { GuidelinesTaskController } from './guidelinestasks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])], // Using DataSource directly
  controllers: [GuidelinesTaskController],
  providers: [GuidelinesTaskService],
  exports: [GuidelinesTaskService],
})
export class GuidelinesTaskModule {}