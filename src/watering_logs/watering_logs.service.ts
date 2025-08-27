import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateWatering_logDto } from './dto/create-watering_log.dto';
import { UpdateWatering_logDto } from './dto/update-watering_log.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class Watering_logService {
  constructor(private readonly dataSource: DataSource) {}  

  // Creates a new watering log record with irrigation data and measurements
  async create(dto: CreateWatering_logDto) {
    const id = uuidv4();    dto.id = id;    await this.dataSource.query(
      `INSERT INTO Watering_logs (id, watering_program_id, generator_start, generator_end, watering_hours, watering_meter_start, watering_meter_end, notes, date) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?)`,
      [id, dto.watering_program_id, dto.generator_start, dto.generator_end, dto.watering_hours, dto.watering_meter_start, dto.watering_meter_end, dto.notes, dto.date],
    );
    return this.findOne(id);
  }

  // Retrieves all watering log records from the database
  async findAll() {
    const rows = await this.dataSource.query(`SELECT 
      BIN_TO_UUID(wl.id) as id,
      JSON_OBJECT(
        'id', BIN_TO_UUID(wp.id),
        'block', JSON_OBJECT(
          'id', BIN_TO_UUID(b.id),
          'code', b.code,
          'name', b.name,
          'area', b.area,
          'coordinates', b.coordinates,
          'sector', JSON_OBJECT(
            'id', BIN_TO_UUID(s.id),
            'code', s.code,
            'name', s.name,
            'area', s.area,
            'coordinates', s.coordinates,
            'farm', JSON_OBJECT(
              'id', BIN_TO_UUID(f.id),
              'code', f.code,
              'name', f.name,
              'area', f.area,
              'coordinates', f.coordinates
            )
          )
        ),
        'well', JSON_OBJECT(
          'id', BIN_TO_UUID(w.id),
          'code', w.code,
          'name', w.name,
          'area', w.area,
          'coordinates', w.coordinates
        ),
        'well_drainage_per_m3', wp.well_drainage_per_m3,
        'watering_liter_per_crop', wp.watering_liter_per_crop,
        'water_frequency_per_week', wp.water_frequency_per_week,
        'pressure', wp.pressure
      ) as watering_program,
      wl.generator_start,
      wl.generator_end,
      wl.watering_hours,
      wl.watering_meter_start,
      wl.watering_meter_end,
      wl.notes,
      wl.date FROM Watering_logs wl
      JOIN Watering_programs wp ON wl.watering_program_id = wp.id
      JOIN Blocks b ON wp.block_id = b.id
      JOIN Wells w ON wp.well_id = w.id
      JOIN Sectors s ON b.sector_id = s.id
      JOIN Farms f ON s.farm_id = f.id
      ORDER BY wl.date ASC`);
    return rows.map(r => ({
      ...r,
      watering_program: typeof r.watering_program === 'string' ? JSON.parse(r.watering_program) : r.watering_program
    }));
  }

  // Finds a specific watering log record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `
      SELECT 
      BIN_TO_UUID(wl.id) as id,
      JSON_OBJECT(
        'id', BIN_TO_UUID(wp.id),
        'block', JSON_OBJECT(
          'id', BIN_TO_UUID(b.id),
          'code', b.code,
          'name', b.name,
          'area', b.area,
          'coordinates', b.coordinates,
          'sector', JSON_OBJECT(
            'id', BIN_TO_UUID(s.id),
            'code', s.code,
            'name', s.name,
            'area', s.area,
            'coordinates', s.coordinates,
            'farm', JSON_OBJECT(
              'id', BIN_TO_UUID(f.id),
              'code', f.code,
              'name', f.name,
              'area', f.area,
              'coordinates', f.coordinates
            )
          )
        ),
        'well', JSON_OBJECT(
          'id', BIN_TO_UUID(w.id),
          'code', w.code,
          'name', w.name,
          'area', w.area,
          'coordinates', w.coordinates
        ),
        'well_drainage_per_m3', wp.well_drainage_per_m3,
        'watering_liter_per_crop', wp.watering_liter_per_crop,
        'water_frequency_per_week', wp.water_frequency_per_week,
        'pressure', wp.pressure
      ) as watering_program,
      wl.generator_start,
      wl.generator_end,
      wl.watering_hours,
      wl.watering_meter_start,
      wl.watering_meter_end,
      wl.notes,
      wl.date FROM Watering_logs wl
      JOIN Watering_programs wp ON wl.watering_program_id = wp.id
      JOIN Blocks b ON wp.block_id = b.id
      JOIN Wells w ON wp.well_id = w.id
      JOIN Sectors s ON b.sector_id = s.id
      JOIN Farms f ON s.farm_id = f.id
      WHERE wl.id = UUID_TO_BIN(?)
      LIMIT 1`,
      [id],
    );
    if (!rows.length) throw new NotFoundException('Watering_logs not found');
    return {
      ...rows[0],
      watering_program: typeof rows[0].watering_program === 'string' ? JSON.parse(rows[0].watering_program) : rows[0].watering_program
    }
  }



  // Updates an existing watering log record with new irrigation data
  async update(id: string, dto: UpdateWatering_logDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.watering_program_id !== undefined) { fields.push('watering_program_id = ?'); values.push(dto.watering_program_id); }
    if (dto.generator_start !== undefined) { fields.push('generator_start = ?'); values.push(dto.generator_start); }
    if (dto.generator_end !== undefined) { fields.push('generator_end = ?'); values.push(dto.generator_end); }
    if (dto.watering_hours !== undefined) { fields.push('watering_hours = ?'); values.push(dto.watering_hours); }
    if (dto.watering_meter_start !== undefined) { fields.push('watering_meter_start = ?'); values.push(dto.watering_meter_start); }
    if (dto.watering_meter_end !== undefined) { fields.push('watering_meter_end = ?'); values.push(dto.watering_meter_end); }
    if (dto.notes !== undefined) { fields.push('notes = ?'); values.push(dto.notes); }
    if (dto.date !== undefined) { fields.push('date = ?'); values.push(dto.date); }
    

    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE Watering_logs SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }



  // Deletes a watering log record from the database
  async remove(id: string) {
    await this.dataSource.query(
      `DELETE FROM Watering_logs WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}

