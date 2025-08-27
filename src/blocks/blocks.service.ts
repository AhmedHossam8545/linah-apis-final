import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { randomUUID } from 'crypto';
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class BlockService {
  constructor(private readonly dataSource: DataSource) {}

  // Creates a new block record with code, name, area and coordinates
  async create(dto: CreateBlockDto) {
    const id = uuidv4();
    dto.id = id;
    await this.dataSource.query(
      `INSERT INTO Blocks (code, name, area, coordinates, sector_id, id) VALUES (?, ?, ?, ?, UUID_TO_BIN(?), UUID_TO_BIN(?))`,
      [dto.code, dto.name, dto.area, dto.coordinates, dto.sector_id, id],   
    );
    return this.findOne(id);
  }

  // Retrieves all block records from the database
  async findAll() {
    const rows = await this.dataSource.query(`SELECT
     BIN_TO_UUID(b.id) as id, 
     b.code, 
     b.name, 
     b.area, 
     b.coordinates,
     JSON_OBJECT(
       'id', BIN_TO_UUID(sector_id),
       'code', sector.code,
       'name', sector.name,
       'area', sector.area,
       'coordinates', sector.coordinates
     ) as sector 
     FROM Blocks b
     JOIN Sectors sector ON b.sector_id = sector.id
     ORDER BY b.name ASC`);
    return rows.map(r => ({
      ...r,
      sector: typeof r.sector === 'string' ? JSON.parse(r.sector) : r.sector
    }));
  }

  // Finds a specific block record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `SELECT
     BIN_TO_UUID(b.id) as id, 
     b.code, 
     b.name, 
     b.area, 
     b.coordinates,
     JSON_OBJECT(
       'id', BIN_TO_UUID(sector_id),
       'code', sector.code,
       'name', sector.name,
       'area', sector.area,
       'coordinates', sector.coordinates
     ) as sector 
     FROM Blocks b
     JOIN Sectors sector ON b.sector_id = sector.id 
      WHERE b.id = UUID_TO_BIN(?)
      LIMIT 1`,
      [id],
    );
    if (!rows.length) throw new NotFoundException('Blocks not found');
    return {
      ...rows[0],
      sector: typeof rows[0].sector === 'string' ? JSON.parse(rows[0].sector) : rows[0].sector
    };
  }

  // Updates an existing block record with new data
  async update(id: string, dto: UpdateBlockDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.code !== undefined) { fields.push('code = ?'); values.push(dto.code); }
    if (dto.name !== undefined) { fields.push('name = ?'); values.push(dto.name); }
    if (dto.area !== undefined) { fields.push('area = ?'); values.push(dto.area); }
    if (dto.coordinates !== undefined) { fields.push('coordinates = ?'); values.push(dto.coordinates); }
    if (dto.sector_id !== undefined) { fields.push('sector_id = ?'); values.push(dto.sector_id); }
   
    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE Blocks SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }

  // Deletes a block record from the database
  async remove(id: string) {
    await this.dataSource.query(
      `DELETE FROM Blocks WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}
