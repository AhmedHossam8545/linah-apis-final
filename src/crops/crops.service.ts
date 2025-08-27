import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { randomUUID } from 'crypto';
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class CropService {
  constructor(private readonly dataSource: DataSource) {}

  // Creates a new crop record with code, name and type information
  async create(dto: CreateCropDto) {
    const id = uuidv4();
    dto.id = id;
    await this.dataSource.query(
      `INSERT INTO Crops (id, code, crop, variety, planted_area, sector_id, plantation_date, harvest_date) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, UUID_TO_BIN(?), ?, ?)`,
      [id, dto.code, dto.crop, dto.variety, dto.planted_area, dto.sector_id, dto.plantation_date, dto.harvest_date],
    );
    return this.findOne(id);
  }

  // Retrieves all crop records from the database
  async findAll() {
    const rows = await this.dataSource.query(`
      SELECT 
        BIN_TO_UUID(c.id) as id,
        c.code,
        c.crop,
        c.variety,
        c.planted_area,
        c.plantation_date,
        c.harvest_date,
        JSON_OBJECT(
          'id', BIN_TO_UUID(s.id),
          'code', s.code,
          'name', s.name,
          'area', s.area,
          'coordinates', s.coordinates
        ) as sector
      FROM Crops c
      JOIN Sectors s ON c.sector_id = s.id
      ORDER BY c.crop ASC
    `);
  
    return rows.map(r => ({
      ...r,
      sector: typeof r.sector === 'string' ? JSON.parse(r.sector) : r.sector
    }));
  }
  
  // Finds a specific crop record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `
      SELECT 
        BIN_TO_UUID(c.id) as id,
        c.code,
        c.crop,
        c.variety,
        c.planted_area,
        c.plantation_date,
        c.harvest_date,
        JSON_OBJECT(
          'id', BIN_TO_UUID(s.id),
          'code', s.code,
          'name', s.name,
          'area', s.area,
          'coordinates', s.coordinates
        ) as sector
      FROM Crops c
      JOIN Sectors s ON c.sector_id = s.id
      WHERE c.id = UUID_TO_BIN(?)
      LIMIT 1
      `,
      [id],
    );
  
    if (!rows.length) throw new NotFoundException('Crop not found');
  
    return {
      ...rows[0],
      sector: typeof rows[0].sector === 'string' ? JSON.parse(rows[0].sector) : rows[0].sector
    };
  }

  // Updates an existing crop record with new data
  async update(id: string, dto: UpdateCropDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.code !== undefined) { fields.push('code = ?'); values.push(dto.code); }
    if (dto.crop !== undefined) { fields.push('crop = ?'); values.push(dto.crop); }
    if (dto.variety !== undefined) { fields.push('variety = ?'); values.push(dto.variety); }
    if (dto.planted_area !== undefined) { fields.push('planted_area = ?'); values.push(dto.planted_area); }
    if (dto.sector_id !== undefined) { fields.push('sector_id = ?'); values.push(dto.sector_id); }
    if (dto.plantation_date !== undefined) { fields.push('plantation_date = ?'); values.push(dto.plantation_date); }
    if (dto.harvest_date !== undefined) { fields.push('harvest_date = ?'); values.push(dto.harvest_date); }
   
    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE Crops SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }

  // Deletes a crop record from the database
  async remove(id: string) {
    await this.dataSource.query(
      `DELETE FROM Crops WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}
