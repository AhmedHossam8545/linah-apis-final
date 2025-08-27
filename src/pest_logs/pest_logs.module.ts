import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pest_logService } from './pest_logs.service';
import { Pest_logController } from './pest_logs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])], // Using DataSource directly
  controllers: [Pest_logController],
  providers: [Pest_logService],
  exports: [Pest_logService],
})
export class Pest_logModule {}