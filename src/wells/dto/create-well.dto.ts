import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWellDto {
  @IsString() @IsNotEmpty()
  code: string;

  @IsString() @IsNotEmpty()
  name: string;

  @IsOptional() @IsNumber()
  area?: number;

  @IsOptional() @IsString()
  coordinates?: string;
  id: string;

}