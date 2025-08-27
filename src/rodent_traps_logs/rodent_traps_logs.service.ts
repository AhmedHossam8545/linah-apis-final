import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateRodent_traps_logDto } from './dto/create-rodent_traps_log.dto';
import { UpdateRodent_traps_logDto } from './dto/update-rodent_traps_log.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class Rodent_traps_logService {
  constructor(private readonly dataSource: DataSource) {}  

  // Creates a new rodent trap log record with catch data and monitoring information
  async create(dto: CreateRodent_traps_logDto) {
    const id = uuidv4();    dto.id = id;    await this.dataSource.query(
      `INSERT INTO Rodent_traps_logs (id, trap_id, setup_date, trap_health, notes, total, food_percent) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?, ?, ?, ?)`,
      [id, dto.trap_id, dto.setup_date, dto.trap_health, dto.notes, dto.total, dto.food_percent],
    );
    return this.findOne(id);
  }

  // Retrieves all rodent trap log records from the database
  async findAll() {
    const rows = await this.dataSource.query(`SELECT 
      BIN_TO_UUID(rtl.id) as id, 
      JSON_OBJECT(
        'id', BIN_TO_UUID(t.id),
        'code', t.code,
        'trap_type', t.trap_type,
        'block', JSON_OBJECT(
          'id', BIN_TO_UUID(b.id),
          'code', b.code,
          'name', b.name,
          'area', b.area,
          'coordinates', b.coordinates
        )
      ) as trap, 
      rtl.setup_date, 
      rtl.trap_health, 
      rtl.notes, 
      rtl.total, 
      rtl.food_percent 
      FROM Rodent_traps_logs rtl
      JOIN Rodent_traps t ON rtl.trap_id = t.id
      JOIN Blocks b ON t.block_id = b.id
      ORDER BY t.code ASC`);
      return rows.map(r => ({
        ...r,
        trap: typeof r.trap === 'string' ? JSON.parse(r.trap) : r.trap
      }));
  }

  // Finds a specific rodent trap log record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `SELECT 
      BIN_TO_UUID(rtl.id) as id, 
      JSON_OBJECT(
        'id', BIN_TO_UUID(t.id),
        'code', t.code,
        'trap_type', t.trap_type,
        'block', JSON_OBJECT(
          'id', BIN_TO_UUID(b.id),
          'code', b.code,
          'name', b.name,
          'area', b.area,
          'coordinates', b.coordinates
        )
      ) as trap, 
      rtl.setup_date, 
      rtl.trap_health, 
      rtl.notes, 
      rtl.total, 
      rtl.food_percent 
      FROM Rodent_traps_logs rtl 
      JOIN Rodent_traps t ON rtl.trap_id = t.id
      JOIN Blocks b ON t.block_id = b.id
      WHERE rtl.id = UUID_TO_BIN(?)
      LIMIT 1`,
      [id],
    );
    if (!rows.length) throw new NotFoundException('Rodent_traps_logs not found');
    return{
      ...rows[0],
      trap: typeof rows[0].trap === 'string' ? JSON.parse(rows[0].trap) : rows[0].trap
    }
  }

 


       // Updates an existing rodent trap log record with new catch data
  async update(id: string, dto: UpdateRodent_traps_logDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.trap_id !== undefined) { fields.push('trap_id = ?'); values.push(dto.trap_id); }
    if (dto.setup_date !== undefined) { fields.push('setup_date = ?'); values.push(dto.setup_date); }
    if (dto.trap_health !== undefined) { fields.push('trap_health = ?'); values.push(dto.trap_health); }
    if (dto.notes !== undefined) { fields.push('notes = ?'); values.push(dto.notes); }
    if (dto.total !== undefined) { fields.push('total = ?'); values.push(dto.total); }
    if (dto.food_percent !== undefined) { fields.push('food_percent = ?'); values.push(dto.food_percent); }

    

    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE Rodent_traps_logs SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }


  // Deletes a rodent trap log record from the database
  async remove(id: string) {
    await this.dataSource.query(
      `DELETE FROM Rodent_traps_logs WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}

