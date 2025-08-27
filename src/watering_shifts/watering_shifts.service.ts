import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateWatering_shiftDto } from './dto/create-watering_shift.dto';
import { UpdateWatering_shiftDto } from './dto/update-watering_shift.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class Watering_shiftService {
  constructor(private readonly dataSource: DataSource) {}  

  // Creates a new watering shift record with worker and schedule information
  async create(dto: CreateWatering_shiftDto) {
    const id = uuidv4();    dto.id = id;    await this.dataSource.query(
      `INSERT INTO Watering_shifts (id, number_of_crops, hours, area, watering_program_id) VALUES (UUID_TO_BIN(?), ?, ?, ?, UUID_TO_BIN(?))`,
      [id, dto.number_of_crops, dto.hours, dto.area, dto.watering_program_id],
    );
    return this.findOne(id);
  }

  // Retrieves all watering shift records from the database
  async findAll() {
    const rows = await this.dataSource.query(`SELECT 
      BIN_TO_UUID(ws.id) as id, 
      ws.number_of_crops, 
      ws.hours, 
      ws.area, 
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
    ) as watering_program
    FROM Watering_shifts ws
    JOIN Watering_programs wp ON ws.watering_program_id = wp.id
    JOIN Blocks b ON wp.block_id = b.id
    JOIN Wells w ON wp.well_id = w.id
    JOIN Sectors s ON b.sector_id = s.id
    JOIN Farms f ON s.farm_id = f.id
    ORDER BY ws.number_of_crops ASC`);
    return rows.map(r => ({
      ...r,
      watering_program: typeof r.watering_program === 'string' ? JSON.parse(r.watering_program) : r.watering_program
    }));
  }

  // Finds a specific watering shift record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `SELECT 
      BIN_TO_UUID(ws.id) as id, 
      ws.number_of_crops, 
      ws.hours, 
      ws.area, 
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
    ) as watering_program
    FROM Watering_shifts ws
    JOIN Watering_programs wp ON ws.watering_program_id = wp.id
    JOIN Blocks b ON wp.block_id = b.id
    JOIN Wells w ON wp.well_id = w.id
    JOIN Sectors s ON b.sector_id = s.id
    JOIN Farms f ON s.farm_id = f.id
    WHERE ws.id = UUID_TO_BIN(?)
    LIMIT 1`,
      [id],
    );
    if (!rows.length) throw new NotFoundException('Watering_shifts not found');
    return{
      ...rows[0],
      watering_program: typeof rows[0].watering_program === 'string' ? JSON.parse(rows[0].watering_program) : rows[0].watering_program
    }
  }

 

   // Updates an existing watering shift record with new schedule data
  async update(id: string, dto: UpdateWatering_shiftDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.number_of_crops !== undefined) { fields.push('number_of_crops = ?'); values.push(dto.number_of_crops); }
    if (dto.hours !== undefined) { fields.push('hours = ?'); values.push(dto.hours); }
    if (dto.area !== undefined) { fields.push('area = ?'); values.push(dto.area); }
    if (dto.watering_program_id !== undefined) { fields.push('watering_program_id = UUID_TO_BIN(?)'); values.push(dto.watering_program_id); }
   
    

    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE Watering_shifts SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }

  // Deletes a watering shift record from the database
  async remove(id: string) {
    await this.dataSource.query(
      `DELETE FROM Watering_shifts WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}

