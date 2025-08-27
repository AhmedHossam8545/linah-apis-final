import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateWellDto } from './dto/create-well.dto';
import { UpdateWellDto } from './dto/update-well.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WellService {
  constructor(private readonly dataSource: DataSource) {}
 // Creates a new well record with code, name, area and coordinates
  async create(dto: CreateWellDto) {
    const id = uuidv4();
    dto.id = id;
    await this.dataSource.query(
      `INSERT INTO Wells (id, code, name, area, coordinates) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?)`,
      [id, dto.code, dto.name, dto.area, dto.coordinates],
    );
    return this.findOne(id);
  }

  // Retrieves all well records from the database
  async findAll() {
    return this.dataSource.query(`SELECT BIN_TO_UUID(id) as id  , code, name, area, coordinates FROM Wells`);
  }

  // Finds a specific well record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `SELECT BIN_TO_UUID(id) as id, code, name, area, coordinates 
      FROM Wells
      WHERE id = UUID_TO_BIN(?)
      LIMIT 1`,
      [id],
    );
    if (!rows.length) throw new NotFoundException('Wells not found');
    return rows[0];
  }

  // Updates an existing well record with new data
  async update(id: string, dto: UpdateWellDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.code !== undefined) { fields.push('code = ?'); values.push(dto.code); }
    if (dto.name !== undefined) { fields.push('name = ?'); values.push(dto.name); }
    if (dto.area !== undefined) { fields.push('area = ?'); values.push(dto.area); }
    if (dto.coordinates !== undefined) { fields.push('coordinates = ?'); values.push(dto.coordinates); }
   
    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE Wells SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }

  // Deletes a well record from the database
  async remove(id: string) {
    await this.dataSource.query(
      `DELETE FROM Wells WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}
