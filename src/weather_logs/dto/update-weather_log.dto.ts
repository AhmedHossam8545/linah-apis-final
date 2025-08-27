import { PartialType } from '@nestjs/mapped-types';
import { CreateWeather_logDto } from './create-weather_log.dto';

export class UpdateWeather_logDto extends PartialType(CreateWeather_logDto) {}