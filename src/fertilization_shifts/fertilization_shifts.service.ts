import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateFertilization_shiftDto } from './dto/create-fertilization_shift.dto';
import { UpdateFertilization_shiftDto } from './dto/update-fertilization_shift.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class Fertilization_shiftService {
  constructor(private readonly dataSource: DataSource) {}

  // Creates a new fertilization shift record with worker and schedule information
  async create(dto: CreateFertilization_shiftDto) {
    const id = uuidv4();    dto.id = id;    await this.dataSource.query(
      `INSERT INTO Fertilization_shifts (id, number_of_crops, hours, area, dose, fertilization_program_id) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, UUID_TO_BIN(?))`,
      [id, dto.number_of_crops, dto.hours, dto.area, dto.dose, dto.fertilization_program_id],
    );
    return this.findOne(id);
  }

  // Retrieves all fertilization shift records from the database
  async findAll() {
    const rows = await this.dataSource.query(`SELECT 
      BIN_TO_UUID(fs.id) as id, 
      fs.number_of_crops, 
      fs.hours, 
      fs.area, 
      fs.dose, 
      BIN_TO_UUID(fs.fertilization_program_id) as fertilization_program_id,
      JSON_OBJECT(
        'id', BIN_TO_UUID(fp.id),
        'fertilizer', fp.fertilizer,
        'dose_per_crop', fp.dose_per_crop,
        'dose_per_acre', fp.dose_per_acre,
        'total_fertilization_area', fp.total_fertilization_area,
        'time', fp.time,
        'drainage', fp.drainage,
        'total_crops', fp.total_crops
      ) as fertilization_program
      FROM Fertilization_shifts fs
      JOIN Fertilization_programs fp ON fp.id = fs.fertilization_program_id
      ORDER BY fs.number_of_crops ASC`);
    return rows.map(row => ({
      ...row,
      fertilization_program: typeof row.fertilization_program === 'string' ? JSON.parse(row.fertilization_program) : row.fertilization_program
    }));
  }

  // Finds a specific fertilization shift record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `SELECT 
      BIN_TO_UUID(fs.id) as id, 
      fs.number_of_crops, 
      fs.hours, 
      fs.area, 
      fs.dose, 
      BIN_TO_UUID(fs.fertilization_program_id) as fertilization_program_id,
      JSON_OBJECT(
        'id', BIN_TO_UUID(fp.id),
        'fertilizer', fp.fertilizer,
        'dose_per_crop', fp.dose_per_crop,
        'dose_per_acre', fp.dose_per_acre,
        'total_fertilization_area', fp.total_fertilization_area,
        'time', fp.time,
        'drainage', fp.drainage,
        'total_crops', fp.total_crops
      ) as fertilization_program
      FROM Fertilization_shifts fs
      JOIN Fertilization_programs fp ON fp.id = fs.fertilization_program_id
      WHERE fs.id = UUID_TO_BIN(?)`,
      [id],
    );
    if (!rows.length) throw new NotFoundException('Fertilization_shifts not found');
    return {
      ...rows[0],
      fertilization_program: typeof rows[0].fertilization_program === 'string' ? JSON.parse(rows[0].fertilization_program) : rows[0].fertilization_program
    }
  }

  // Updates an existing fertilization shift record with new schedule data
  async update(id: string, dto: UpdateFertilization_shiftDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.number_of_crops !== undefined) { fields.push('number_of_crops = ?'); values.push(dto.number_of_crops); }
    if (dto.hours !== undefined) { fields.push('hours = ?'); values.push(dto.hours); }
    if (dto.area !== undefined) { fields.push('area = ?'); values.push(dto.area); }
    if (dto.dose !== undefined) { fields.push('dose = ?'); values.push(dto.dose); }
    if (dto.fertilization_program_id !== undefined) { fields.push('fertilization_program_id = UUID_TO_BIN(?)'); values.push(dto.fertilization_program_id); }

    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE Fertilization_shifts SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }

  // Deletes a fertilization shift record from the database
  async remove(id: string) {
    await this.dataSource.query(
      `DELETE FROM Fertilization_shifts WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}

