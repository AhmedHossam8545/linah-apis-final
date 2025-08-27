import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDiseaseDto {
  @IsString() @IsNotEmpty()
  code: string;

  @IsString() @IsNotEmpty()
  name: string;

  @IsString() @IsNotEmpty()
  cause: string;

  @IsOptional() @IsString()
  pest?: string;

  @IsString() @IsNotEmpty()
  pest_id: string;

  @IsString() @IsNotEmpty()
  fungus_id: string;

  @IsString() @IsNotEmpty()
  symptoms: string;
  id: string;
}