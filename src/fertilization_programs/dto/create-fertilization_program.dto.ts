import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFertilization_programDto {
  @IsString() @IsNotEmpty()
  fertilizer: string;

  @IsNumber() @IsNotEmpty()
  dose_per_crop: number;

  @IsNumber() @IsNotEmpty()
  dose_per_acre: number;

  @IsOptional() @IsNumber()
  total_fertilization_area?: number;

  @IsString() @IsNotEmpty()
  time: string;

  @IsOptional() @IsString()
  drainage?: string;

  @IsString() @IsNotEmpty()
  crop_fertilized_id: string;

  @IsOptional() @IsNumber()
  total_crops?: number;
  id: string;

}