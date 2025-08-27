import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePests_seasonDto {
  @IsString() @IsNotEmpty()
  pest_id: string;

  @IsString() @IsNotEmpty()
  season_from: string;

  @IsString() @IsNotEmpty()
  season_to: string;
  id: string;

}