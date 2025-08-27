import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateWatering_programDto } from './dto/create-watering_program.dto';
import { UpdateWatering_programDto } from './dto/update-watering_program.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class Watering_programService {
  constructor(private readonly dataSource: DataSource) {}  

  // Creates a new watering program record with schedule and block assignment
  async create(dto: CreateWatering_programDto) {
    const id = uuidv4();    dto.id = id;    await this.dataSource.query(
      `INSERT INTO Watering_programs (id, block_id, well_id, well_drainage_per_m3, watering_liter_per_crop, water_frequency_per_week, pressure) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?, ?, ?)`,
      [id, dto.block_id, dto.well_id, dto.well_drainage_per_m3, dto.watering_liter_per_crop, dto.water_frequency_per_week, dto.pressure],
    );
    return this.findOne(id);
  }

  // Retrieves all watering program records from the database
  async findAll() {
    const rows = await this.dataSource.query(`SELECT 
      BIN_TO_UUID(wp.id) as id, 
      wp.well_drainage_per_m3, 
      wp.watering_liter_per_crop, 
      wp.water_frequency_per_week, 
      wp.pressure,
      JSON_OBJECT(
        'id', BIN_TO_UUID(w.id),
        'code', w.code,
        'name', w.name,
        'area', w.area,
        'coordinates', w.coordinates
      ) as well,
      JSON_OBJECT(
        'id', BIN_TO_UUID(b.id),
        'code', b.code,
        'name', b.name,
        'area', b.area,
        'coordinates', b.coordinates
      ) as block
      FROM Watering_programs wp
      JOIN Wells w ON wp.well_id = w.id
      JOIN Blocks b ON wp.block_id = b.id
      ORDER BY wp.id ASC`);
    return rows .map(r => ({
      ...r,
      well: typeof r.well === 'string' ? JSON.parse(r.well) : r.well,
      block: typeof r.block === 'string' ? JSON.parse(r.block) : r.block
    }));
  }

  // Finds a specific watering program record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `SELECT 
      BIN_TO_UUID(wp.id) as id, 
      wp.well_drainage_per_m3, 
      wp.watering_liter_per_crop, 
      wp.water_frequency_per_week, 
      wp.pressure,
      JSON_OBJECT(
        'id', BIN_TO_UUID(w.id),
        'code', w.code,
        'name', w.name,
        'area', w.area,
        'coordinates', w.coordinates
      ) as well, 
      JSON_OBJECT(
        'id', BIN_TO_UUID(b.id),
        'code', b.code,
        'name', b.name,
        'area', b.area,
        'coordinates', b.coordinates
      ) as block
      FROM Watering_programs wp
      JOIN Wells w ON wp.well_id = w.id
      JOIN Blocks b ON wp.block_id = b.id
      WHERE wp.id = UUID_TO_BIN(?)`,
      [id],
    );
    if (!rows.length) throw new NotFoundException('Watering_programs not found');
    return rows .map(r => ({
      ...r,
      well: typeof r.well === 'string' ? JSON.parse(r.well) : r.well,
      block: typeof r.block === 'string' ? JSON.parse(r.block) : r.block
    }));
  }

 


     // Updates an existing watering program record with new schedule data
  async update(id: string, dto: UpdateWatering_programDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.block_id !== undefined) { fields.push('block_id = ?'); values.push(dto.block_id); }
    if (dto.well_id !== undefined) { fields.push('well_id = ?'); values.push(dto.well_id); }
    if (dto.well_drainage_per_m3 !== undefined) { fields.push('well_drainage_per_m3 = ?'); values.push(dto.well_drainage_per_m3); }
    if (dto.watering_liter_per_crop !== undefined) { fields.push('watering_liter_per_crop = ?'); values.push(dto.watering_liter_per_crop); }
    if (dto.water_frequency_per_week !== undefined) { fields.push('water_frequency_per_week = ?'); values.push(dto.water_frequency_per_week); }
    if (dto.pressure !== undefined) { fields.push('pressure = ?'); values.push(dto.pressure); }
   
    

    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE Watering_programs SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }

  // Deletes a watering program record from the database
  async remove(id: string) {
    await this.dataSource.query(
      `DELETE FROM Watering_programs WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}

