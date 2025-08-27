import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePest_logDto {
  @IsString() @IsNotEmpty()
  pest_id: string;

  @IsString() @IsNotEmpty()
  crop_status: string;

  @IsString() @IsNotEmpty()
  action_status: string;
  id: string;

}