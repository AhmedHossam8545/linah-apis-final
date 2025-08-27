import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInventoryDto {
  @IsString() @IsNotEmpty()
  code: string;

  @IsString() @IsNotEmpty()
  common_name: string;

  @IsString() @IsNotEmpty()
  trade_name: string;

  @IsOptional() @IsString()
  manufacturing_company?: string;

  @IsOptional() @IsNumber()
  quantity?: number;

  @IsOptional() @IsString()
  active_ingredient?: string;

  @IsString() @IsNotEmpty()
  measuring_unit: string;

  @IsOptional() @IsNumber()
  price?: number;

  @IsString() @IsNotEmpty()
  type: string;

  @IsOptional() @IsString()
  notes?: string;

  @IsOptional() @IsString()
  fumagation?: string;

  @IsOptional() @IsNumber()
  fumagation_cost?: number;

  @IsOptional() @IsNumber()
  dose_percent?: number;
  id: string;

}