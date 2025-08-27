import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateFertilization_programDto } from './dto/create-fertilization_program.dto';
import { UpdateFertilization_programDto } from './dto/update-fertilization_program.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class Fertilization_programService {
  constructor(private readonly dataSource: DataSource) {}

  // Creates a new fertilization program record with name, type and schedule details
  async create(dto: CreateFertilization_programDto) {
    const id = uuidv4();    dto.id = id;    await this.dataSource.query(
      `INSERT INTO Fertilization_programs (id, fertilizer, dose_per_crop, dose_per_acre, total_fertilization_area, time, drainage, crop_fertilized_id, total_crops) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, UUID_TO_BIN(?), ?)`,
      [id, dto.fertilizer, dto.dose_per_crop, dto.dose_per_acre, dto.total_fertilization_area, dto.time, dto.drainage, dto.crop_fertilized_id, dto.total_crops],
    );
    return this.findOne(id);
  }

  // Retrieves all fertilization program records from the database
  async findAll() {
    const rows = await this.dataSource.query(`SELECT 
      BIN_TO_UUID(fp.id) as id, 
      fp.fertilizer, 
      fp.dose_per_crop, 
      fp.dose_per_acre, 
      fp.total_fertilization_area, 
      fp.time, 
      fp.drainage, 
      fp.total_crops,
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
      ) as crop
      FROM Fertilization_programs fp
      JOIN Crops c ON fp.crop_fertilized_id = c.id
      JOIN Sectors s ON c.sector_id = s.id
      ORDER BY fp.fertilizer ASC`
    );
    return rows.map((r: any) => ({
      ...r,
      crop: typeof r.crop === 'string' ? JSON.parse(r.crop) : r.crop
    }))
  }

  // Finds a specific fertilization program record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `SELECT 
      BIN_TO_UUID(fp.id) as id, 
      fp.fertilizer, 
      fp.dose_per_crop, 
      fp.dose_per_acre, 
      fp.total_fertilization_area, 
      fp.time, 
      fp.drainage, 
      fp.total_crops,
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
      ) as crop
      FROM Fertilization_programs fp
      JOIN Crops c ON fp.crop_fertilized_id = c.id
      JOIN Sectors s ON c.sector_id = s.id
      WHERE fp.id = UUID_TO_BIN(?)`,
      [id],
    );
    if (!rows.length) throw new NotFoundException('Fertilization_programs not found');
    return {
      ...rows[0],
      crop: typeof rows[0].crop === 'string' ? JSON.parse(rows[0].crop) : rows[0].crop
    }
  }



  // Updates an existing fertilization program record with new data
  async update(id: string, dto: UpdateFertilization_programDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.fertilizer !== undefined) { fields.push('fertilizer = ?'); values.push(dto.fertilizer); }
    if (dto.dose_per_crop !== undefined) { fields.push('dose_per_crop = ?'); values.push(dto.dose_per_crop); }
    if (dto.dose_per_acre !== undefined) { fields.push('dose_per_acre = ?'); values.push(dto.dose_per_acre); }
    if (dto.total_fertilization_area !== undefined) { fields.push('total_fertilization_area = ?'); values.push(dto.total_fertilization_area); }
    if (dto.time !== undefined) { fields.push('time = ?'); values.push(dto.time); }
    if (dto.drainage !== undefined) { fields.push('drainage = ?'); values.push(dto.drainage); }
    if (dto.crop_fertilized_id !== undefined) { fields.push('crop_fertilized_id = ?'); values.push(dto.crop_fertilized_id); }
    if (dto.total_crops !== undefined) { fields.push('total_crops = ?'); values.push(dto.total_crops); }
    

    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE Fertilization_programs SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }


  // Deletes a fertilization program record from the database
  async remove(id: string) {
    await this.dataSource.query(
      `DELETE FROM Fertilization_programs WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}

