import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInsect_trapDto {
  @IsString() @IsNotEmpty()
  code: string;

  @IsString() @IsNotEmpty()
  trap_id: string;

  @IsOptional() @IsString()
  type?: string;

  @IsString() @IsNotEmpty()
  sector_id: string;

  @IsOptional() @IsString()
  acetate?: string;
  id: string;

}