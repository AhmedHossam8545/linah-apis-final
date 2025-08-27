import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFertilization_shiftDto {
  @IsNumber() @IsNotEmpty()
  number_of_crops: number;

  @IsNumber() @IsNotEmpty()
  hours: number;

  @IsOptional() @IsNumber()
  area?: number;

  @IsOptional() @IsNumber()
  dose?: number;

  @IsString() @IsNotEmpty()
  fertilization_program_id: string;
  id: string;

}