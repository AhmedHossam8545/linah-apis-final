import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateAuditorDto } from './dto/create-auditor.dto';
import { UpdateAuditorDto } from './dto/update-auditor.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuditorService {
  constructor(private readonly dataSource: DataSource) {}

  // Creates a new auditor record with code and name information
  async create(dto: CreateAuditorDto) {
    const id = uuidv4();
    dto.id = id;
    await this.dataSource.query(
      `INSERT INTO Auditors (id, code, name) VALUES (UUID_TO_BIN(?), ?, ?)`,
      [id, dto.code, dto.name],
    );
    return this.findOne(id);
  }

  // Retrieves all auditor records ordered by name
  async findAll() {
    return this.dataSource.query(`SELECT BIN_TO_UUID(id) as id, code, name 
      FROM Auditors 
      ORDER BY name ASC`);
  }

  // Finds a specific auditor record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `SELECT BIN_TO_UUID(id) as id, code, name 
      FROM Auditors 
      WHERE id = UUID_TO_BIN(?)
      LIMIT 1`,
      [id],
    );
    if (!rows.length) throw new NotFoundException('Auditors not found');
    return rows[0];
  }

  // Updates an existing auditor record with new code or name data
  async update(id: string, dto: UpdateAuditorDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.code !== undefined) { fields.push('code = ?'); values.push(dto.code); }
    if (dto.name !== undefined) { fields.push('name = ?'); values.push(dto.name); }
   
    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE Auditors SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }

  // Deletes an auditor record from the database
  async remove(id: string) {
    await this.dataSource.query(
      `DELETE FROM Auditors WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}
