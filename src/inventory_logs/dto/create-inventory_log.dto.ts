import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInventory_logDto {
  @IsString() @IsNotEmpty()
  product_id: string;

  @IsString() @IsNotEmpty()
  log: string;

  @IsString() @IsNotEmpty()
  date: string;

  @IsOptional() @IsNumber()
  number_of_crops_affected?: number;

  @IsOptional() @IsNumber()
  consumption?: number;
  id: string;

}