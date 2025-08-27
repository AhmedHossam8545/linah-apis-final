import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreatePests_seasonDto } from './dto/create-pests_season.dto';
import { UpdatePests_seasonDto } from './dto/update-pests_season.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class Pests_seasonService {
  constructor(private readonly dataSource: DataSource) {}  

  // Creates a new pest season record with timing and crop association data
  async create(dto: CreatePests_seasonDto) {
    const id = uuidv4();
    await this.dataSource.query(
      `INSERT INTO Pests_seasons (id, pest_id, season_from, season_to) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?)`,
      [id, dto.pest_id, dto.season_from, dto.season_to],
    );
    return this.findOne(id);
  }

  // Retrieves all pest season records from the database
  async findAll() {
    const rows = await this.dataSource.query(`SELECT 
      BIN_TO_UUID(ps.id) as id,
      JSON_OBJECT(
        'id', BIN_TO_UUID(p.id),
        'code', p.code,
        'name', p.name,
        'dose', p.dose,
        'season', p.season
      ) as pest,
      ps.season_from,
      ps.season_to
      FROM Pests_seasons ps
      JOIN Pests p ON ps.pest_id = p.id
      ORDER BY p.code ASC`);
    return rows.map(r => ({
      ...r,
      pest: typeof r.pest === 'string' ? JSON.parse(r.pest) : r.pest
    }));
  }

  // Finds a specific pest season record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `SELECT 
        BIN_TO_UUID(ps.id) as id,
        JSON_OBJECT(
          'id', BIN_TO_UUID(p.id),
          'code', p.code,
          'name', p.name,
          'dose', p.dose,
          'season', p.season
        ) as pest,
        ps.season_from,
        ps.season_to
        FROM Pests_seasons ps
        JOIN Pests p ON ps.pest_id = p.id
        WHERE ps.id = UUID_TO_BIN(?)`,
      [id],
    );
    if (!rows.length) throw new NotFoundException('Pests_seasons not found');
    return {
      ...rows[0],
      pest: typeof rows[0].pest === 'string' ? JSON.parse(rows[0].pest) : rows[0].pest
    };
  }

  // Updates an existing pest season record with new timing data
  async update(id: string, dto: UpdatePests_seasonDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.pest_id !== undefined) { fields.push('pest_id = UUID_TO_BIN(?)'); values.push(dto.pest_id); }
    if (dto.season_from !== undefined) { fields.push('season_from = ?'); values.push(dto.season_from); }
    if (dto.season_to !== undefined) { fields.push('season_to = ?'); values.push(dto.season_to); }

    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE Pests_seasons SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }

  // Deletes a pest season record from the database
  async remove(id: string) {
    await this.dataSource.query(
      `DELETE FROM Pests_seasons WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}

