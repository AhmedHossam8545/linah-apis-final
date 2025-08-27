import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateGuidelinesTaskDto } from './dto/create-guidelinestask.dto';
import { UpdateGuidelinesTaskDto } from './dto/update-guidelinestask.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GuidelinesTaskService {
  constructor(private readonly dataSource: DataSource) {}

  // Creates a new guidelines task record with task details and scheduling information
  async create(dto: CreateGuidelinesTaskDto) {
    const id = uuidv4();    dto.id = id;    await this.dataSource.query(
      `INSERT INTO GuidelinesTasks (id, task, type, status, when_to_act) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?)`,
      [id, dto.task, dto.type, dto.status, dto.when_to_act],
    );
    return this.findOne(id);
  }

  // Retrieves all guidelines task records from the database
  async findAll() {
    return this.dataSource.query(`SELECT BIN_TO_UUID(id) as id, task, type, status, when_to_act FROM GuidelinesTasks`);
  }

  // Finds a specific guidelines task record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `SELECT BIN_TO_UUID(id) as id, task, type, status, when_to_act 
      FROM GuidelinesTasks 
      WHERE id = UUID_TO_BIN(?)
      LIMIT 1`,
      [id],
    );
    if (!rows.length) throw new NotFoundException('GuidelinesTasks not found');
    return rows[0];
  }

  // Updates an existing guidelines task record with new data
  async update(id: string, dto: UpdateGuidelinesTaskDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.task !== undefined) { fields.push('task = ?'); values.push(dto.task); }
    if (dto.type !== undefined) { fields.push('type = ?'); values.push(dto.type); }
    if (dto.status !== undefined) { fields.push('status = ?'); values.push(dto.status); }
    if (dto.when_to_act !== undefined) { fields.push('when_to_act = ?'); values.push(dto.when_to_act); }

    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE GuidelinesTasks SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }

  // Deletes a guidelines task record from the database
  async remove(id: string) {
    await this.dataSource.query(
      `DELETE FROM GuidelinesTasks WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}

