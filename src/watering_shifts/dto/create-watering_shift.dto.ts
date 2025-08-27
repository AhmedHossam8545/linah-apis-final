import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWatering_shiftDto {
  @IsNumber() @IsNotEmpty()
  number_of_crops: number;

  @IsNumber() @IsNotEmpty()
  hours: number;

  @IsOptional() @IsNumber()
  area?: number;

  @IsString() @IsNotEmpty()
  watering_program_id: string;
  id: string;

}