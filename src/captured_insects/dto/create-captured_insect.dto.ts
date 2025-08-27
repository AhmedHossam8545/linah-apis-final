import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCaptured_insectDto {
  @IsString() @IsNotEmpty()
  trap_type: string;

  @IsOptional() @IsNumber()
  male?: number;

  @IsOptional() @IsNumber()
  females?: number;

  @IsString() @IsNotEmpty()
  date: Date;

  @IsOptional() @IsString()
  insect_type?: string;
  id:string;

}