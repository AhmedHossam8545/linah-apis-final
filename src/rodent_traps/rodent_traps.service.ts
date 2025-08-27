import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateRodent_trapDto } from './dto/create-rodent_trap.dto';
import { UpdateRodent_trapDto } from './dto/update-rodent_trap.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class Rodent_trapService {
  constructor(private readonly dataSource: DataSource) {}  

  // Creates a new rodent trap record with location and configuration data
  async create(dto: CreateRodent_trapDto) {
    const id = uuidv4();
    dto.id = id;
    await this.dataSource.query(
      // `INSERT INTO Rodent_traps (code, trap_type, block_id, id) VALUES (?, ?, UUID_TO_BIN(?, 1), UUID_TO_BIN(?, 1))`,
      `INSERT INTO Rodent_traps (code, trap_type, block_id, id) VALUES (?, ?, UUID_TO_BIN(?), UUID_TO_BIN(?))`,
      [dto.code, dto.trap_type, dto.block_id, id],
    );
    
    return this.findOne(id);
  }

  // Retrieves all rodent trap records from the database
  async findAll() {
    const rows = await this.dataSource.query(`SELECT 
      BIN_TO_UUID(rs.id) as id, 
      rs.code, 
      rs.trap_type, 
      JSON_OBJECT(
        'id', BIN_TO_UUID(b.id),
        'code', b.code,
        'name', b.name,
        'area', b.area,
        'coordinates', b.coordinates
      ) as block
      FROM Rodent_traps rs
      JOIN Blocks b ON rs.block_id = b.id
      ORDER BY rs.code ASC`);
    return rows.map(r => ({
      ...r,
      block: typeof r.block === 'string' ? JSON.parse(r.block) : r.block
    }));
  }

  // Finds a specific rodent trap record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `SELECT 
      BIN_TO_UUID(rs.id) as id, 
      rs.code, 
      rs.trap_type, 
      JSON_OBJECT(
        'id', BIN_TO_UUID(b.id),
        'code', b.code,
        'name', b.name,
        'area', b.area,
        'coordinates', b.coordinates
      ) as block
      FROM Rodent_traps rs 
      JOIN Blocks b ON rs.block_id = b.id
      WHERE rs.id = UUID_TO_BIN(?)`,
      [id],
    );
    if (!rows.length) throw new NotFoundException('Rodent_traps not found');
    return{
      ...rows[0],
      block: typeof rows[0].block === 'string' ? JSON.parse(rows[0].block) : rows[0].block
    }
  }

 


      // Updates an existing rodent trap record with new configuration
  async update(id: string, dto: UpdateRodent_trapDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.code !== undefined) { fields.push('code = ?'); values.push(dto.code); }
    if (dto.trap_type !== undefined) { fields.push('trap_type = ?'); values.push(dto.trap_type); }
    if (dto.block_id !== undefined) { fields.push('block_id = ?'); values.push(dto.block_id); }

      

    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE Rodent_traps SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }

  // Deletes a rodent trap record from the database
  async remove(id: string) {
    await this.dataSource.query(
      `DELETE FROM Rodent_traps WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}

