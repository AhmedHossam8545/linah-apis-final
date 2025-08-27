import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePesticides_logDto {
  @IsString() @IsNotEmpty()
  pest: string;

  @IsString() @IsNotEmpty()
  sector_id: string;

  @IsString() @IsNotEmpty()
  date: string;

  @IsNumber() @IsNotEmpty()
  number_of_plants: number;

  @IsString() @IsNotEmpty()
  crop_id: string;

  @IsOptional() @IsString()
  type?: string;

  @IsOptional() @IsNumber()
  affected_area?: number;

  @IsOptional() @IsString()
  area_measurement_unit?: string;

  @IsOptional() @IsString()
  affected_crop_part?: string;

  @IsOptional() @IsString()
  purpose?: string;

  @IsOptional() @IsString()
  infection_status?: string;

  @IsString() @IsNotEmpty()
  pesticide_name: string;

  @IsOptional() @IsNumber()
  dose_per_crop_per_cm?: number;

  @IsOptional() @IsNumber()
  solvent_concentration?: number;

  @IsOptional() @IsNumber()
  total_solvents_sizes?: number;

  @IsOptional() @IsNumber()
  dose_used?: number;

  @IsOptional() @IsString()
  dose_measurement_unit?: string;

  @IsOptional() @IsString()
  safety_days?: string;

  @IsString() @IsNotEmpty()
  machine_id: string;

  @IsString() @IsNotEmpty()
  auditor_id: string;

  @IsString() @IsNotEmpty()
  engineer_id: string;

  @IsOptional() @IsNumber()
  number_of_workers?: number;

  @IsString() @IsNotEmpty()
  detection_date: string;

  @IsOptional() @IsString()
  treatment_date?: string;

  @IsOptional() @IsString()
  finder?: string;

  @IsOptional() @IsString()
  notes?: string;

  @IsString() @IsNotEmpty()
  examined_by_id: string;
  id: string;

}