import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCropDto {
  @IsString() @IsNotEmpty()
  code: string;

  @IsString() @IsNotEmpty()
  crop: string;

  @IsOptional() @IsString()
  variety?: string;

  @IsOptional() @IsNumber()
  planted_area?: number;

  @IsString() @IsNotEmpty()
  sector_id: string;

  @IsString() @IsNotEmpty()
  plantation_date: Date;


  @IsOptional() @IsString()
  harvest_date?: Date;
  id:string;
}