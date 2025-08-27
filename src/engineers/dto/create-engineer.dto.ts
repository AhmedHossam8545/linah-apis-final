import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEngineerDto {
  @IsString() @IsNotEmpty()
  code: string;

  @IsString() @IsNotEmpty()
  name: string;
  id: string;

}