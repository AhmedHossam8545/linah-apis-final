import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreatePestDto } from './dto/create-pest.dto';
import { UpdatePestDto } from './dto/update-pest.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PestService {
  constructor(private readonly dataSource: DataSource) {}  

  // Creates a new pest record with code, name, dose and season information
  async create(dto: CreatePestDto) {
    const id = uuidv4();
    dto.id = id;
    await this.dataSource.query(
      `INSERT INTO Pests (id, code, name, pesticide_id, dose, infected_crop_id, season) VALUES (UUID_TO_BIN(?), ?, ?, UUID_TO_BIN(?), ?, UUID_TO_BIN(?), ?)`,
      [id, dto.code, dto.name, dto.pesticide_id, dto.dose, dto.infected_crop_id, dto.season],
    );
    return this.findOne(id);
  }

  // Retrieves all pest records from the database
  async findAll() {
    const rows = await this.dataSource.query(`SELECT 
      BIN_TO_UUID(p.id) as id,
      p.code,
      p.name,
      JSON_OBJECT(
        'id', BIN_TO_UUID(pl.id),
        'pest', pl.pest,
        'date', pl.date,
        'pesticide_name', pl.pesticide_name
      ) as pesticide,
      p.dose,
      JSON_OBJECT(
        'id', BIN_TO_UUID(c.id),
        'code', c.code,
        'crop', c.crop,
        'variety', c.variety,
        'planted_area', c.planted_area,
        'plantation_date', c.plantation_date,
        'harvest_date', c.harvest_date
      ) as infected_crop,
      p.season
      FROM Pests p
      JOIN Pesticides_logs pl ON p.pesticide_id = pl.id
      JOIN Crops c ON p.infected_crop_id = c.id
      ORDER BY p.code ASC`);
    return rows.map(r => ({
      ...r,
      pesticide: typeof r.pesticide === 'string' ? JSON.parse(r.pesticide) : r.pesticide,
      infected_crop: typeof r.infected_crop === 'string' ? JSON.parse(r.infected_crop) : r.infected_crop
    }));
  }

  // Finds a specific pest record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `SELECT 
      BIN_TO_UUID(p.id) as id,
      p.code,
      p.name,
      JSON_OBJECT(
        'id', BIN_TO_UUID(pl.id),
        'pest', pl.pest,
        'date', pl.date,
        'pesticide_name', pl.pesticide_name
      ) as pesticide,
      p.dose,
      JSON_OBJECT(
        'id', BIN_TO_UUID(c.id),
        'code', c.code,
        'crop', c.crop,
        'variety', c.variety,
        'planted_area', c.planted_area,
        'plantation_date', c.plantation_date,
        'harvest_date', c.harvest_date
      ) as infected_crop,
      p.season
      FROM Pests p
      JOIN Pesticides_logs pl ON p.pesticide_id = pl.id
      JOIN Crops c ON p.infected_crop_id = c.id
      WHERE p.id = UUID_TO_BIN(?)`,
      [id],
    );
    if (!rows.length) throw new NotFoundException('Pests not found');
    return {
      ...rows[0],
      pesticide: typeof rows[0].pesticide === 'string' ? JSON.parse(rows[0].pesticide) : rows[0].pesticide,
      infected_crop: typeof rows[0].infected_crop === 'string' ? JSON.parse(rows[0].infected_crop) : rows[0].infected_crop
    };
  }

  // Updates an existing pest record with new information
  async update(id: string, dto: UpdatePestDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.code !== undefined) { fields.push('code = ?'); values.push(dto.code); }
    if (dto.name !== undefined) { fields.push('name = ?'); values.push(dto.name); }
    if (dto.pesticide_id !== undefined) { fields.push('pesticide_id = UUID_TO_BIN(?)'); values.push(dto.pesticide_id); }
    if (dto.dose !== undefined) { fields.push('dose = ?'); values.push(dto.dose); }
    if (dto.infected_crop_id !== undefined) { fields.push('infected_crop_id = UUID_TO_BIN(?)'); values.push(dto.infected_crop_id); }
    if (dto.season !== undefined) { fields.push('season = ?'); values.push(dto.season); }
   
    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE Pests SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }

  // Deletes a pest record from the database
  async remove(id: string) {
    await this.dataSource.query(
      `DELETE FROM Pests WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}
