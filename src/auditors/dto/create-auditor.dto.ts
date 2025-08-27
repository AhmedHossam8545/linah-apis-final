import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAuditorDto {
  @IsString() @IsNotEmpty()
  code!: string;

  @IsString() @IsNotEmpty()
  name!: string;
  id!: string;

}