import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateInsect_traps_logDto } from './dto/create-insect_traps_log.dto';
import { UpdateInsect_traps_logDto } from './dto/update-insect_traps_log.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class Insect_traps_logService {
  constructor(private readonly dataSource: DataSource) {}

  // Creates a new insect traps log record with trap monitoring data
  async create(dto: CreateInsect_traps_logDto) {
    const id = uuidv4();    dto.id = id;    await this.dataSource.query(
      `INSERT INTO Insect_traps_logs (id, trap_id, setup_date, health, notes) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?, ?)`,
      [id, dto.trap_id, dto.setup_date, dto.health, dto.notes],
    );
    return this.findOne(id);
  }

  // Retrieves all insect traps log records from the database
  async findAll() {
    const rows = await this.dataSource.query(`SELECT 
      BIN_TO_UUID(itl.id) as id, 
      JSON_OBJECT(
        'id', BIN_TO_UUID(it.id),
        'code', it.code,
        'type', it.type,
        'acetate', it.acetate,
        'captured_trap',JSON_OBJECT(
          'id', BIN_TO_UUID(ci.id),
          'trap_type', ci.trap_type,
          'male', ci.male,
          'females', ci.females,
          'date', ci.date,
          'insect_type', ci.insect_type
        ),
        'sector', JSON_OBJECT(
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
        )
      ) as insect_trap,
      itl.setup_date, 
      itl.health, 
      itl.notes 
      FROM Insect_traps_logs itl
      JOIN Insect_traps it ON itl.trap_id = it.id
      JOIN Sectors s ON it.sector_id = s.id
      JOIN Farms f ON s.farm_id = f.id
      JOIN Captured_insects ci ON it.trap_id = ci.id
      ORDER BY it.code ASC`);
    return rows.map(r => ({
      ...r,
      insect_trap: typeof r.insect_trap === 'string' ? JSON.parse(r.insect_trap) : r.insect_trap
    }));
  }

  // Finds a specific insect traps log record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `SELECT 
      BIN_TO_UUID(itl.id) as id, 
      JSON_OBJECT(
        'id', BIN_TO_UUID(it.id),
        'code', it.code,
        'type', it.type,
        'acetate', it.acetate,
        'captured_trap', JSON_OBJECT(
          'id', BIN_TO_UUID(ci.id),
          'trap_type', ci.trap_type,
          'male', ci.male,
          'females', ci.females,
          'date', ci.date,
          'insect_type', ci.insect_type
        ),
        'sector', JSON_OBJECT(
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
        )
      ) as insect_trap,
      itl.setup_date, 
      itl.health, 
      itl.notes 
      FROM Insect_traps_logs itl
      JOIN Insect_traps it ON itl.trap_id = it.id
      JOIN Sectors s ON it.sector_id = s.id
      JOIN Farms f ON s.farm_id = f.id
      JOIN Captured_insects ci ON it.trap_id = ci.id
      WHERE itl.id = UUID_TO_BIN(?)`,
      [id],
    );
    if (!rows.length) throw new NotFoundException('Insect_traps_logs not found');
    return{
      ...rows[0],
      insect_trap: typeof rows[0].insect_trap === 'string' ? JSON.parse(rows[0].insect_trap) : rows[0].insect_trap
    }
  }

  

  // Updates an existing insect traps log record with new monitoring data
  async update(id: string, dto: UpdateInsect_traps_logDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.trap_id !== undefined) { fields.push('trap_id = ?'); values.push(dto.trap_id); }
    if (dto.setup_date !== undefined) { fields.push('setup_date = ?'); values.push(dto.setup_date); }
    if (dto.health !== undefined) { fields.push('health = ?'); values.push(dto.health); }
    if (dto.notes !== undefined) { fields.push('notes = ?'); values.push(dto.notes); }

    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE Insect_traps_logs SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }

  // Deletes an insect traps log record from the database
  async remove(id: string) {
    await this.dataSource.query(
      `DELETE FROM Insect_traps_logs WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}

