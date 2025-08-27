import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateFungiDto } from './dto/create-fungi.dto';
import { UpdateFungiDto } from './dto/update-fungi.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FungiService {
  constructor(private readonly dataSource: DataSource) {}

  // Creates a new fungus record with code, name and dose information
  async create(dto: CreateFungiDto) {
    const id = uuidv4();
    dto.id = id;
    await this.dataSource.query(
      `INSERT INTO Fungi (id, code, name, fungicide_id, dose, infected_crop_id) VALUES (UUID_TO_BIN(?), ?, ?, UUID_TO_BIN(?), ?, UUID_TO_BIN(?))`,
      [id, dto.code, dto.name, dto.fungicide_id, dto.dose, dto.infected_crop_id],
    );
    return this.findOne(id);
  }

  // Retrieves all fungus records from the database
  async findAll() {
    const rows = await this.dataSource.query(`SELECT 
      BIN_TO_UUID(f.id) as id, 
      f.code, 
      f.name, 
      JSON_OBJECT(
        'id', BIN_TO_UUID(fl.id),
        'fungus', fl.fungus,
        'date', fl.date,
        'pesticide_name', fl.fungicide_name
      ) as fungicide,
      f.dose,
      JSON_OBJECT(
        'id', BIN_TO_UUID(c.id),
        'code', c.code,
        'crop', c.crop,
        'variety', c.variety,
        'planted_area', c.planted_area,
        'plantation_date', c.plantation_date,
        'harvest_date', c.harvest_date
      ) as infected_crop
      FROM Fungi f
      JOIN Fungicides_logs fl ON f.fungicide_id = fl.id
      JOIN Crops c ON f.infected_crop_id = c.id
      ORDER BY f.code ASC`);
    return rows.map(r => ({
      ...r,
      fungicide: typeof r.fungicide === 'string' ? JSON.parse(r.fungicide) : r.fungicide,
      infected_crop: typeof r.infected_crop === 'string' ? JSON.parse(r.infected_crop) : r.infected_crop
    }));
  }

  // Finds a specific fungus record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `SELECT 
      BIN_TO_UUID(f.id) as id, 
      f.code, 
      f.name, 
      JSON_OBJECT(
        'id', BIN_TO_UUID(fl.id),
        'fungus', fl.fungus,
        'date', fl.date,
        'pesticide_name', fl.fungicide_name
      ) as fungicide,
      f.dose,
      JSON_OBJECT(
        'id', BIN_TO_UUID(c.id),
        'code', c.code,
        'crop', c.crop,
        'variety', c.variety,
        'planted_area', c.planted_area,
        'plantation_date', c.plantation_date,
        'harvest_date', c.harvest_date
      ) as infected_crop
      FROM Fungi f
      JOIN Fungicides_logs fl ON f.fungicide_id = fl.id
      JOIN Crops c ON f.infected_crop_id = c.id
      WHERE f.id = UUID_TO_BIN(?)`,
      [id],
    );
    if (!rows.length) throw new NotFoundException('Fungi not found');
    return {
      ...rows[0],
      fungicide: typeof rows[0].fungicide === 'string' ? JSON.parse(rows[0].fungicide) : rows[0].fungicide,
      infected_crop: typeof rows[0].infected_crop === 'string' ? JSON.parse(rows[0].infected_crop) : rows[0].infected_crop
    };
  }

  // Updates an existing fungus record with new data
  async update(id: string, dto: UpdateFungiDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.code !== undefined) { fields.push('code = ?'); values.push(dto.code); }
    if (dto.name !== undefined) { fields.push('name = ?'); values.push(dto.name); }
    if (dto.fungicide_id !== undefined) { fields.push('fungicide_id = UUID_TO_BIN(?)'); values.push(dto.fungicide_id); }
    if (dto.dose !== undefined) { fields.push('dose = ?'); values.push(dto.dose); }
    if (dto.infected_crop_id !== undefined) { fields.push('infected_crop_id = UUID_TO_BIN(?)'); values.push(dto.infected_crop_id); }
   
    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE Fungi SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }

  // Deletes a fungus record from the database
  async remove(id: string) {
    await this.dataSource.query(
      `DELETE FROM Fungi WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}
