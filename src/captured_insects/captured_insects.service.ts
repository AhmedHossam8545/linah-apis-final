import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateCaptured_insectDto } from './dto/create-captured_insect.dto';
import { UpdateCaptured_insectDto } from './dto/update-captured_insect.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CapturedInsectService {
  constructor(private readonly dataSource: DataSource) {}

  // Creates a new captured insect record with trap data and insect counts
  async create(dto: CreateCaptured_insectDto) {
    const id = uuidv4();
    dto.id = id;
    await this.dataSource.query(
      `INSERT INTO Captured_insects (id, trap_type, male, females, date, insect_type) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?)`,
      [id, dto.trap_type, dto.male, dto.females, dto.date, dto.insect_type],
    );
    return this.findOne(id);
  }

  // Retrieves all captured insect records from the database
  async findAll() {
    return this.dataSource.query(`SELECT 
      BIN_TO_UUID(ci.id) as id, 
      ci.trap_type, 
      ci.male, 
      ci.females, 
      ci.date, 
      ci.insect_type 
      FROM Captured_insects ci`);
  }

  // Finds a specific captured insect record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `SELECT 
      BIN_TO_UUID(ci.id) as id, 
      ci.trap_type, 
      ci.male, 
      ci.females, 
      ci.date, 
      ci.insect_type 
      FROM Captured_insects ci WHERE ci.id = UUID_TO_BIN(?)`,
      [id],
    );
    if (!rows.length) throw new NotFoundException('Captured_insects not found');
    return rows[0];
  }

  // Updates an existing captured insect record with new trap or count data
  async update(id: string, dto: UpdateCaptured_insectDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.trap_type !== undefined) { fields.push('trap_type = ?'); values.push(dto.trap_type); }
    if (dto.male !== undefined) { fields.push('male = ?'); values.push(dto.male); }
    if (dto.females !== undefined) { fields.push('females = ?'); values.push(dto.females); }
    if (dto.date !== undefined) { fields.push('date = ?'); values.push(dto.date); }
    if (dto.insect_type !== undefined) { fields.push('insect_type = ?'); values.push(dto.insect_type); }
   
    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE Captured_insects SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }

  // Deletes a captured insect record from the database
  async remove(id: string) {
    await this.dataSource.query(
      `DELETE FROM Captured_insects WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}
