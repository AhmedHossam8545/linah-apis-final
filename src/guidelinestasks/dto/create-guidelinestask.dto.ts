import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGuidelinesTaskDto {
  @IsString() @IsNotEmpty()
  task: string;

  @IsString() @IsNotEmpty()
  type: string;

  @IsString() @IsNotEmpty()
  status: string;

  @IsString() @IsNotEmpty()
  when_to_act: string;
  id: string;

}