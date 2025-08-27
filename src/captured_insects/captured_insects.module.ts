import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CapturedInsectService } from './captured_insects.service';
import { CapturedInsectController } from './captured_insects.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])], // Using DataSource directly
  controllers: [CapturedInsectController],
  providers: [CapturedInsectService],
  exports: [CapturedInsectService],
})
export class CapturedInsectModule {}