import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WorkerService {
  constructor(private readonly dataSource: DataSource) {}

  // Creates a new worker record with code and name information
  async create(dto: CreateWorkerDto) {
    const id = uuidv4();    dto.id = id;    await this.dataSource.query(
      `INSERT INTO Workers (id, code, name) VALUES (UUID_TO_BIN(?), ?, ?)`,
      [id, dto.code, dto.name],
    );
    return this.findOne(id);
  }

  // Retrieves all worker records from the database
  async findAll() {
    return this.dataSource.query(`SELECT BIN_TO_UUID(id) as id, code, name FROM Workers`);
  }

  // Finds a specific worker record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `SELECT BIN_TO_UUID(id) as id, code, name FROM Workers WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    if (!rows.length) throw new NotFoundException('Workers not found');
    return rows[0];
  }

  

    // Updates an existing worker record with new code or name data
    async update(id: string, dto: UpdateWorkerDto) {
    const fields: string[] = [];
    const values: any[] = [];
    
    if (dto.code !== undefined) { fields.push('code = ?'); values.push(dto.code); }
    if (dto.name !== undefined) { fields.push('name = ?'); values.push(dto.name); }
  
    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE Workers SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }

  // Deletes a worker record from the database
  async remove(id: string) {
    await this.dataSource.query(
      `DELETE FROM Workers WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}

