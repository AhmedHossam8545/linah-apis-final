import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWeather_logDto {
  @IsNumber() @IsNotEmpty()
  temperature: number;

  @IsNumber() @IsNotEmpty()
  wind: number;

  @IsNumber() @IsNotEmpty()
  humidity: number;
  id: string;

}