import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePestDto {
  @IsString() @IsNotEmpty()
  code: string;

  @IsString() @IsNotEmpty()
  name: string;

  @IsString() @IsNotEmpty()
  pesticide_id: string;

  @IsOptional() @IsNumber()
  dose?: number;

  @IsString() @IsNotEmpty()
  infected_crop_id: string;

  @IsString() @IsNotEmpty()
  season: string;
  id: string;
}