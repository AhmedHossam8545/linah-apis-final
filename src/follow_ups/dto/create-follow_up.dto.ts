import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFollow_upDto {
  @IsString() @IsNotEmpty()
  log: string;

  @IsString() @IsNotEmpty()
  date: string;

  @IsOptional() @IsString()
  recommendations?: string;
  id: string;

}