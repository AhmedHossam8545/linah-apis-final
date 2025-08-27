import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreatePest_logDto } from './dto/create-pest_log.dto';
import { UpdatePest_logDto } from './dto/update-pest_log.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class Pest_logService {
  constructor(private readonly dataSource: DataSource) {}

  // Creates a new pest log record with detection data and treatment information
  async create(dto: CreatePest_logDto) {
    const id = uuidv4();
    await this.dataSource.query(
      `INSERT INTO Pest_logs (id, pest_id, crop_status, action_status) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?)`,
      [id, dto.pest_id, dto.crop_status, dto.action_status],
    );
    return this.findOne(id);
  }

  // Retrieves all pest log records from the database
  async findAll() {
    const rows = await this.dataSource.query(`SELECT 
      BIN_TO_UUID(pl.id) as id,
      JSON_OBJECT(
        'id', BIN_TO_UUID(p.id),
        'code', p.code,
        'name', p.name,
        'dose', p.dose,
        'season', p.season
      ) as pest,
      pl.crop_status,
      pl.action_status
      FROM Pest_logs pl
      JOIN Pests p ON pl.pest_id = p.id
      ORDER BY p.code ASC`);
    return rows.map(r => ({
      ...r,
      pest: typeof r.pest === 'string' ? JSON.parse(r.pest) : r.pest
    }));
  }

  // Finds a specific pest log record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `SELECT 
        BIN_TO_UUID(pl.id) as id,
        JSON_OBJECT(
          'id', BIN_TO_UUID(p.id),
          'code', p.code,
          'name', p.name,
          'dose', p.dose,
          'season', p.season
        ) as pest,
        pl.crop_status,
        pl.action_status
        FROM Pest_logs pl
        JOIN Pests p ON pl.pest_id = p.id
        WHERE pl.id = UUID_TO_BIN(?)`,
      [id],
    );
    if (!rows.length) throw new NotFoundException('Pest_logs not found');
    return {
      ...rows[0],
      pest: typeof rows[0].pest === 'string' ? JSON.parse(rows[0].pest) : rows[0].pest
    };
  }

  // Updates an existing pest log record with new detection or treatment data
  async update(id: string, dto: UpdatePest_logDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.pest_id !== undefined) { fields.push('pest_id = UUID_TO_BIN(?)'); values.push(dto.pest_id); }
    if (dto.crop_status !== undefined) { fields.push('crop_status = ?'); values.push(dto.crop_status); }
    if (dto.action_status !== undefined) { fields.push('action_status = ?'); values.push(dto.action_status); }

    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE Pest_logs SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }

  // Deletes a pest log record from the database
  async remove(id: string) {
    await this.dataSource.query(
      `DELETE FROM Pest_logs WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}

