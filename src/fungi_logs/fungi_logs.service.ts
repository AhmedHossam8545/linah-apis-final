import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateFungi_logDto } from './dto/create-fungi_log.dto';
import { UpdateFungi_logDto } from './dto/update-fungi_log.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class Fungi_logService {
  constructor(private readonly dataSource: DataSource) {}

  // Creates a new fungi log record with detection data and treatment information
  async create(dto: CreateFungi_logDto) {
    const id = uuidv4();
    dto.id = id;
    await this.dataSource.query(
      `INSERT INTO Fungi_logs (id, fungi_id, crop_status, action_status) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?)`,
      [id, dto.fungi_id, dto.crop_status, dto.action_status],
    );
    return this.findOne(id);
  }

  // Retrieves all fungi log records from the database
  async findAll() {
    const rows = await this.dataSource.query(`SELECT 
      BIN_TO_UUID(fl.id) as id,
      JSON_OBJECT(
        'id', BIN_TO_UUID(f.id),
        'code', f.code,
        'name', f.name,
        'dose', f.dose
      ) as fungi,
      fl.crop_status,
      fl.action_status
      FROM Fungi_logs fl
      JOIN Fungi f ON fl.fungi_id = f.id
      ORDER BY fl.id ASC`);
    return rows.map(r => ({
      ...r,
      fungi: typeof r.fungi === 'string' ? JSON.parse(r.fungi) : r.fungi
    }));
  }

  // Finds a specific fungi log record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `SELECT 
      BIN_TO_UUID(fl.id) as id,
      JSON_OBJECT(
        'id', BIN_TO_UUID(f.id),
        'code', f.code,
        'name', f.name,
        'dose', f.dose
      ) as fungi,
      fl.crop_status,
      fl.action_status
      FROM Fungi_logs fl
      JOIN Fungi f ON fl.fungi_id = f.id
      WHERE fl.id = UUID_TO_BIN(?)`,
      [id],
    );
    if (!rows.length) throw new NotFoundException('Fungi_logs not found');
    return {
      ...rows[0],
      fungi: typeof rows[0].fungi === 'string' ? JSON.parse(rows[0].fungi) : rows[0].fungi
    };
  }



    // Updates an existing fungi log record with new detection or treatment data
  async update(id: string, dto: UpdateFungi_logDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.fungi_id !== undefined) { fields.push('fungi_id = UUID_TO_BIN(?)'); values.push(dto.fungi_id); }
    if (dto.crop_status !== undefined) { fields.push('crop_status = ?'); values.push(dto.crop_status); }
    if (dto.action_status !== undefined) { fields.push('action_status = ?'); values.push(dto.action_status); }

    

    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE Fungi_logs SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }

  // Deletes a fungi log record from the database
  async remove(id: string) {
    await this.dataSource.query(
      `DELETE FROM Fungi_logs WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}

