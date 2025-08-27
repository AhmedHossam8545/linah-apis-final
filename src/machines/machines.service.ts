import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MachineService {
  constructor(private readonly dataSource: DataSource) {}

  // Creates a new machine record with code, name and type information
  async create(dto: CreateMachineDto) {
    const id = uuidv4();    dto.id = id;    await this.dataSource.query(
      `INSERT INTO Machines (id, code, type) VALUES (UUID_TO_BIN(?), ?, ?)`,
      [id, dto.code, dto.type],
    );
    return this.findOne(id);
  }

  // Retrieves all machine records from the database
  async findAll() {
    return this.dataSource.query(`SELECT BIN_TO_UUID(id) as id, code, type FROM Machines`);
  }

  // Finds a specific machine record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `SELECT BIN_TO_UUID(id) as id, code, type FROM Machines WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    if (!rows.length) throw new NotFoundException('Machines not found');
    return rows[0];
  }



    // Updates an existing machine record with new data
  async update(id: string, dto: UpdateMachineDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.code !== undefined) { fields.push('code = ?'); values.push(dto.code); }
    if (dto.type !== undefined) { fields.push('type = ?'); values.push(dto.type); }
    

    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE Machines SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }

  // Deletes a machine record from the database
  async remove(id: string) {
    await this.dataSource.query(
      `DELETE FROM Machines WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}

