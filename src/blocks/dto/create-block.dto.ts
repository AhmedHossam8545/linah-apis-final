import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBlockDto {
  @IsString() @IsNotEmpty()
  code: string;

  @IsString() @IsNotEmpty()
  name: string;

  @IsOptional() @IsNumber()
  area?: number;

  @IsOptional() @IsString()
  coordinates?: string;

  @IsString() @IsNotEmpty()
  sector_id: string;
  id:string;
}