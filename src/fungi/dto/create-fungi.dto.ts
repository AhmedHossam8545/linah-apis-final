import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFungiDto {
  @IsString() @IsNotEmpty()
  code: string;

  @IsString() @IsNotEmpty()
  name: string;

  @IsString() @IsNotEmpty()
  fungicide_id: string;

  @IsOptional() @IsNumber()
  dose?: number;

  @IsString() @IsNotEmpty()
  infected_crop_id: string;
  id: string;

}