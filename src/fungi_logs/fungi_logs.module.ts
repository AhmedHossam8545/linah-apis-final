import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fungi_logService } from './fungi_logs.service';
import { Fungi_logController } from './fungi_logs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])], // Using DataSource directly
  controllers: [Fungi_logController],
  providers: [Fungi_logService],
  exports: [Fungi_logService],
})
export class Fungi_logModule {}