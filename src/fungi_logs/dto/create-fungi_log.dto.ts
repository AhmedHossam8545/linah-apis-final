import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFungi_logDto {
  @IsString() @IsNotEmpty()
  fungi_id: string;

  @IsString() @IsNotEmpty()
  crop_status: string;

  @IsString() @IsNotEmpty()
  action_status: string;
  id: string;

}