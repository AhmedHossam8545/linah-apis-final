import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateWeather_logDto } from './dto/create-weather_log.dto';
import { UpdateWeather_logDto } from './dto/update-weather_log.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class Weather_logService {
  constructor(private readonly dataSource: DataSource) {}  

  // Creates a new weather log record with meteorological data and measurements
  async create(dto: CreateWeather_logDto) {
    const id = uuidv4();    dto.id = id;    await this.dataSource.query(
      `INSERT INTO Weather_logs (id, temperature, wind, humidity) VALUES (UUID_TO_BIN(?), ?, ?, ?)`,
      [id, dto.temperature, dto.wind, dto.humidity],
    );
    return this.findOne(id);
  }

  // Retrieves all weather log records from the database
  async findAll() {
    return this.dataSource.query(`SELECT BIN_TO_UUID(id) as id, temperature, wind, humidity FROM Weather_logs`);
  }

  // Finds a specific weather log record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `SELECT BIN_TO_UUID(id) as id, temperature, wind, humidity FROM Weather_logs WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    if (!rows.length) throw new NotFoundException('Weather_logs not found');
    return rows[0];
  }



   // Updates an existing weather log record with new meteorological data
  async update(id: string, dto: UpdateWeather_logDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.temperature !== undefined) { fields.push('temperature = ?'); values.push(dto.temperature); }
    if (dto.wind !== undefined) { fields.push('wind = ?'); values.push(dto.wind); }
    if (dto.humidity !== undefined) { fields.push('humidity = ?'); values.push(dto.humidity); }
    
    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE Weather_logs SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }

  // Deletes a weather log record from the database
  async remove(id: string) {
    await this.dataSource.query(
      `DELETE FROM Weather_logs WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}

