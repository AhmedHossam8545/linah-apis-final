import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FungiService } from './fungi.service';
import { FungiController } from './fungi.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])], // Using DataSource directly
  controllers: [FungiController],
  providers: [FungiService],
  exports: [FungiService],
})
export class FungiModule {}