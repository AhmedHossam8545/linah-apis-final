import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWatering_programDto {
  @IsString() @IsNotEmpty()
  block_id: string;

  @IsString() @IsNotEmpty()
  well_id: string;

  @IsOptional() @IsNumber()
  well_drainage_per_m3?: number;

  @IsOptional() @IsNumber()
  watering_liter_per_crop?: number;

  @IsNumber() @IsNotEmpty()
  water_frequency_per_week: number;

  @IsOptional() @IsNumber()
  pressure?: number;
  id: string;

}