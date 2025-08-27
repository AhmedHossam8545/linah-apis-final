import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateInsect_trapDto } from './dto/create-insect_trap.dto';
import { UpdateInsect_trapDto } from './dto/update-insect_trap.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class Insect_trapService {
  constructor(private readonly dataSource: DataSource) {}

  // Creates a new insect trap record with trap type and location information
  async create(dto: CreateInsect_trapDto) {
    const id = uuidv4();    dto.id = id;    await this.dataSource.query(
      `INSERT INTO Insect_traps (id, code, trap_id, type, sector_id, acetate) VALUES (UUID_TO_BIN(?), ?, UUID_TO_BIN(?), ?, UUID_TO_BIN(?), ?)`,
      [id, dto.code, dto.trap_id, dto.type, dto.sector_id, dto.acetate],
    );
    return this.findOne(id);
  }

  // Retrieves all insect trap records from the database
  async findAll() {
    const rows = await this.dataSource.query(`SELECT 
      BIN_TO_UUID(it.id) as id, 
      it.code, 
      JSON_OBJECT(
        'id', BIN_TO_UUID(ci.id),
        'trap_type', ci.trap_type,
        'male', ci.male,
        'females', ci.females,
        'date', ci.date,
        'insect_type', ci.insect_type
      ) as trap,
      it.type, 
      JSON_OBJECT(
        'id', BIN_TO_UUID(s.id),
        'code', s.code,
        'name', s.name,
        'area', s.area,
        'coordinates', s.coordinates,
        'farm', JSON_OBJECT(
          'id', BIN_TO_UUID(f.id),
          'code', f.code,
          'name', f.name,
          'area', f.area,
          'coordinates', f.coordinates
        )
      ) as sector,
      it.acetate 
      FROM Insect_traps it
      JOIN Captured_insects ci ON it.trap_id = ci.id
      JOIN Sectors s ON it.sector_id = s.id
      JOIN Farms f ON s.farm_id = f.id
      ORDER BY it.code ASC`);
      return rows.map(r => ({
        ...r,
        trap: typeof r.trap === 'string' ? JSON.parse(r.trap) : r.trap,
        sector: typeof r.sector === 'string' ? JSON.parse(r.sector) : r.sector
      }));
  }

  // Finds a specific insect trap record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `SELECT 
      BIN_TO_UUID(it.id) as id, 
      it.code, 
      JSON_OBJECT(
        'id', BIN_TO_UUID(ci.id),
        'trap_type', ci.trap_type,
        'male', ci.male,
        'females', ci.females,
        'date', ci.date,
        'insect_type', ci.insect_type
      ) as trap,
      it.type, 
      JSON_OBJECT(
        'id', BIN_TO_UUID(s.id),
        'code', s.code,
        'name', s.name,
        'area', s.area,
        'coordinates', s.coordinates,
        'farm', JSON_OBJECT(
          'id', BIN_TO_UUID(f.id),
          'code', f.code,
          'name', f.name,
          'area', f.area,
          'coordinates', f.coordinates
        )
      ) as sector,
      it.acetate 
      FROM Insect_traps it
      JOIN Captured_insects ci ON it.trap_id = ci.id
      JOIN Sectors s ON it.sector_id = s.id
      JOIN Farms f ON s.farm_id = f.id
      WHERE it.id = UUID_TO_BIN(?)`,
      [id],
    );
    if (!rows.length) throw new NotFoundException('Insect_traps not found');
    return rows.map(r => ({
      ...r,
      trap: typeof r.trap === 'string' ? JSON.parse(r.trap) : r.trap,
      sector: typeof r.sector === 'string' ? JSON.parse(r.sector) : r.sector
    }))[0];
  }



  // Updates an existing insect trap record with new data
  async update(id: string, dto: UpdateInsect_trapDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.code !== undefined) { fields.push('code = ?'); values.push(dto.code); }
    if (dto.sector_id !== undefined) { fields.push('sector_id = UUID_TO_BIN(?, 1)'); values.push(dto.sector_id); }
    if (dto.trap_id !== undefined) { fields.push('trap_id = UUID_TO_BIN(?, 1)'); values.push(dto.trap_id); }
    if (dto.type !== undefined) { fields.push('type = ?'); values.push(dto.type); }
    if (dto.acetate !== undefined) { fields.push('acetate = ?'); values.push(dto.acetate); }

    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE Insect_traps SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }

  // Deletes an insect trap record from the database
  async remove(id: string) {
    await this.dataSource.query(
      `DELETE FROM Insect_traps WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}

