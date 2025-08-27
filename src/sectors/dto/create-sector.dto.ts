import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSectorDto {
  @IsString() @IsNotEmpty()
  code: string;

  @IsString() @IsNotEmpty()
  name: string;

  @IsOptional() @IsNumber()
  area?: number;

  @IsOptional() @IsString()
  coordinates?: string;

  @IsString() @IsNotEmpty()
  farm_id: string;
  id: string;

}