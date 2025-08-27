import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateFollow_upDto } from './dto/create-follow_up.dto';
import { UpdateFollow_upDto } from './dto/update-follow_up.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class Follow_upService {
  constructor(private readonly dataSource: DataSource) {}

  // Creates a new follow-up record with task details and scheduling information
  async create(dto: CreateFollow_upDto) {
    const id = uuidv4();    dto.id = id;    await this.dataSource.query(
      `INSERT INTO Follow_ups (id, log, date, recommendations) VALUES (UUID_TO_BIN(?), ?, ?, ?)`,
      [id, dto.log, dto.date, dto.recommendations],
    );
    return this.findOne(id);
  }

  // Retrieves all follow-up records from the database
  async findAll() {
    return this.dataSource.query(`SELECT BIN_TO_UUID(id) as id, log, date, recommendations FROM Follow_ups`);
  }

  // Finds a specific follow-up record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `SELECT BIN_TO_UUID(id) as id, log, date, recommendations FROM Follow_ups WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    if (!rows.length) throw new NotFoundException('Follow_ups not found');
    return rows[0];
  }



  // Updates an existing follow-up record with new task or scheduling data
  async update(id: string, dto: UpdateFollow_upDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.log !== undefined) { fields.push('log = ?'); values.push(dto.log); }
    if (dto.date !== undefined) { fields.push('date = ?'); values.push(dto.date); }
    if (dto.recommendations !== undefined) { fields.push('recommendations = ?'); values.push(dto.recommendations); }
    

    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE Follow_ups SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }

  // Deletes a follow-up record from the database
  async remove(id: string) {
    await this.dataSource.query(
      `DELETE FROM Follow_ups WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}

