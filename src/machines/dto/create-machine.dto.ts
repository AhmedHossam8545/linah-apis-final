import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMachineDto {
  @IsString() @IsNotEmpty()
  code: string;

  @IsString() @IsNotEmpty()
  type: string;
  id: string;

}