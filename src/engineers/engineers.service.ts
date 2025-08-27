import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateEngineerDto } from './dto/create-engineer.dto';
import { UpdateEngineerDto } from './dto/update-engineer.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EngineerService {
  constructor(private readonly dataSource: DataSource) {}

  // Creates a new engineer record with code and name information
  async create(dto: CreateEngineerDto) {
    const id = uuidv4();    dto.id = id;    await this.dataSource.query(
      `INSERT INTO Engineers (id, code, name) VALUES (UUID_TO_BIN(?), ?, ?)`,
      [id, dto.code, dto.name],
    );
    return this.findOne(id);
  }

  // Retrieves all engineer records from the database
  async findAll() {
    return this.dataSource.query(`SELECT BIN_TO_UUID(id) as id, code, name FROM Engineers`);
  }

  // Finds a specific engineer record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `SELECT BIN_TO_UUID(id) as id, code, name FROM Engineers WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    if (!rows.length) throw new NotFoundException('Engineers not found');
    return rows[0];
  }


    // Updates an existing engineer record with new data
  async update(id: string, dto: UpdateEngineerDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.code !== undefined) { fields.push('code = ?'); values.push(dto.code); }
    if (dto.name !== undefined) { fields.push('name = ?'); values.push(dto.name); }
 

    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE Engineers SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }

  // Deletes an engineer record from the database
  async remove(id: string) {
    await this.dataSource.query(
      `DELETE FROM Engineers WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}

