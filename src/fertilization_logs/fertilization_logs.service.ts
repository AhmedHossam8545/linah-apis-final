import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateFertilization_logDto } from './dto/create-fertilization_log.dto';
import { UpdateFertilization_logDto } from './dto/update-fertilization_log.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class Fertilization_logService {
  constructor(private readonly dataSource: DataSource) {}

  // Creates a new fertilization log record with date, type and application details
  async create(dto: CreateFertilization_logDto) {
    const id = uuidv4();    
    dto.id = id;    
    await this.dataSource.query(
      `INSERT INTO Fertilization_logs (id, sector_id, crop_id, total_fertilization_area, total_crops, dose_used, dose_not_used, reason, fertilization_program_id, date) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?, ?, ?, ?, UUID_TO_BIN(?), ?)`,
      [id, dto.sector_id, dto.crop_id, dto.total_fertilization_area, dto.total_crops, dto.dose_used, dto.dose_not_used, dto.reason, dto.fertilization_program_id, dto.date],
    );
    return this.findOne(id);
  }

  // Retrieves all fertilization log records from the database
  async findAll() {
    const rows = await this.dataSource.query(`SELECT 
      BIN_TO_UUID(fl.id) as id, 
      BIN_TO_UUID(fl.sector_id) as sector_id, 
      BIN_TO_UUID(fl.crop_id) as crop_id, 
      fl.total_fertilization_area, 
      fl.total_crops, 
      fl.dose_used, 
      fl.dose_not_used, 
      fl.reason, 
      BIN_TO_UUID(fl.fertilization_program_id) as fertilization_program_id, 
      fl.date, 
      JSON_OBJECT(
        'id', BIN_TO_UUID(c.id),
        'code', c.code,
        'crop', c.crop,
        'variety', c.variety,
        'planted_area', c.planted_area,
        'sector', JSON_OBJECT(
          'id', BIN_TO_UUID(s.id),
          'code', s.code,
          'name', s.name,
          'area', s.area,
          'coordinates', s.coordinates
        ),
        'plantation_date', c.plantation_date,
        'harvest_date', c.harvest_date
      ) as crop,
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
    FROM Fertilization_logs fl
    JOIN Crops c ON c.id = fl.crop_id
    JOIN Sectors s ON c.sector_id = s.id
    JOIN Fertilization_programs fp ON fp.id = fl.fertilization_program_id
    ORDER BY c.crop ASC`);
    return rows.map(row => ({
      ...row,
      crop: typeof row.crop === 'string' ? JSON.parse(row.crop) : row.crop,
      fertilization_program: typeof row.fertilization_program === 'string' ? JSON.parse(row.fertilization_program) : row.fertilization_program
    }));
  }

  // Finds a specific fertilization log record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `SELECT 
      BIN_TO_UUID(fl.id) as id, 
      BIN_TO_UUID(fl.sector_id) as sector_id, 
      BIN_TO_UUID(fl.crop_id) as crop_id, 
      fl.total_fertilization_area, 
      fl.total_crops, 
      fl.dose_used, 
      fl.dose_not_used, 
      fl.reason, 
      BIN_TO_UUID(fl.fertilization_program_id) as fertilization_program_id, 
      fl.date, 
      JSON_OBJECT(
        'id', BIN_TO_UUID(c.id),
        'code', c.code,
        'crop', c.crop,
        'variety', c.variety,
        'planted_area', c.planted_area,
        'sector', JSON_OBJECT(
          'id', BIN_TO_UUID(s.id),
          'code', s.code,
          'name', s.name,
          'area', s.area,
          'coordinates', s.coordinates
        ),
        'plantation_date', c.plantation_date,
        'harvest_date', c.harvest_date
      ) as crop,
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
      FROM Fertilization_logs fl
      JOIN Crops c ON c.id = fl.crop_id
      JOIN Sectors s ON c.sector_id = s.id
      JOIN Fertilization_programs fp ON fp.id = fl.fertilization_program_id
      WHERE fl.id = UUID_TO_BIN(?)
      LIMIT 1`,
      [id],
    );
    if (!rows.length) throw new NotFoundException('Fertilization_logs not found');
    return{
      ...rows[0],
      crop: typeof rows[0].crop === 'string' ? JSON.parse(rows[0].crop) : rows[0].crop,
      fertilization_program: typeof rows[0].fertilization_program === 'string' ? JSON.parse(rows[0].fertilization_program) : rows[0].fertilization_program
    }
  }

  // Updates an existing fertilization log record with new data
  async update(id: string, dto: UpdateFertilization_logDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.sector_id !== undefined) { fields.push('sector_id = ?'); values.push(dto.sector_id); }
    if (dto.crop_id !== undefined) { fields.push('crop_id = ?'); values.push(dto.crop_id); }
    if (dto.total_fertilization_area !== undefined) { fields.push('total_fertilization_area = ?'); values.push(dto.total_fertilization_area); }
    if (dto.total_crops !== undefined) { fields.push('total_crops = ?'); values.push(dto.total_crops); }
    if (dto.dose_used !== undefined) { fields.push('dose_used = ?'); values.push(dto.dose_used); }
    if (dto.dose_not_used !== undefined) { fields.push('dose_not_used = ?'); values.push(dto.dose_not_used); }
    if (dto.reason !== undefined) { fields.push('reason = ?'); values.push(dto.reason); }
    if (dto.fertilization_program_id !== undefined) { fields.push('fertilization_program_id = ?'); values.push(dto.fertilization_program_id); }
    if (dto.date !== undefined) { fields.push('date = ?'); values.push(dto.date); }

    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE Fertilization_logs SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }

  // Deletes a fertilization log record from the database
  async remove(id: string) {
    await this.dataSource.query(
      `DELETE FROM Fertilization_logs WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}

