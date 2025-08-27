import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateDiseaseDto } from './dto/create-disease.dto';
import { UpdateDiseaseDto } from './dto/update-disease.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DiseaseService {
  constructor(private readonly dataSource: DataSource) {}

  // Creates a new disease record with name, symptoms and treatment information
  async create(dto: CreateDiseaseDto) {
    const id = uuidv4();
    await this.dataSource.query(
      `INSERT INTO Diseases (id, code, name, cause, pest, pest_id, fungus_id, symptoms) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, UUID_TO_BIN(?), UUID_TO_BIN(?), ?)`,
      [id, dto.code, dto.name, dto.cause, dto.pest, dto.pest_id, dto.fungus_id, dto.symptoms],
    );
    return this.findOne(id);
  }

  // Retrieves all disease records from the database
  async findAll() {
    const rows = await this.dataSource.query(`SELECT 
      BIN_TO_UUID(d.id) as id,
      d.code,
      d.name,
      d.cause,
      d.pest,
      JSON_OBJECT(
        'id', BIN_TO_UUID(p.id),
        'code', p.code,
        'name', p.name,
        'dose', p.dose,
        'season', p.season
      ) as pest_details,
      JSON_OBJECT(
        'id', BIN_TO_UUID(f.id),
        'code', f.code,
        'name', f.name,
        'dose', f.dose
        
      ) as fungus,
      d.symptoms
      FROM Diseases d
      JOIN Pests p ON d.pest_id = p.id
      JOIN Fungi f ON d.fungus_id = f.id
      ORDER BY d.code ASC`);
    return rows.map(r => ({
      ...r,
      pest_details: typeof r.pest_details === 'string' ? JSON.parse(r.pest_details) : r.pest_details,
      fungus: typeof r.fungus === 'string' ? JSON.parse(r.fungus) : r.fungus
    }));
  }

  // Finds a specific disease record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `SELECT 
        BIN_TO_UUID(d.id) as id,
        d.code,
        d.name,
        d.cause,
        d.pest,
        JSON_OBJECT(
          'id', BIN_TO_UUID(p.id),
          'code', p.code,
          'name', p.name,
          'dose', p.dose,
          'season', p.season
        ) as pest_details,
        JSON_OBJECT(
          'id', BIN_TO_UUID(f.id),
          'code', f.code,
          'name', f.name,
          'dose', f.dose
        ) as fungus,
        d.symptoms
        FROM Diseases d
        JOIN Pests p ON d.pest_id = p.id
        JOIN Fungi f ON d.fungus_id = f.id
        WHERE d.id = UUID_TO_BIN(?)`,
      [id],
    );
    if (!rows.length) throw new NotFoundException('Diseases not found');
    return {
      ...rows[0],
      pest_details: typeof rows[0].pest_details === 'string' ? JSON.parse(rows[0].pest_details) : rows[0].pest_details,
      fungus: typeof rows[0].fungus === 'string' ? JSON.parse(rows[0].fungus) : rows[0].fungus
    };
  }

  // Updates an existing disease record with new information
  async update(id: string, dto: UpdateDiseaseDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.code !== undefined) { fields.push('code = ?'); values.push(dto.code); }
    if (dto.name !== undefined) { fields.push('name = ?'); values.push(dto.name); }
    if (dto.cause !== undefined) { fields.push('cause = ?'); values.push(dto.cause); }
    if (dto.pest !== undefined) { fields.push('pest = ?'); values.push(dto.pest); }
    if (dto.pest_id !== undefined) { fields.push('pest_id = UUID_TO_BIN(?)'); values.push(dto.pest_id); }
    if (dto.fungus_id !== undefined) { fields.push('fungus_id = UUID_TO_BIN(?)'); values.push(dto.fungus_id); }
    if (dto.symptoms !== undefined) { fields.push('symptoms = ?'); values.push(dto.symptoms); }
   
    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE Diseases SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }

  // Deletes a disease record from the database
  async remove(id: string) {
    await this.dataSource.query(
      `DELETE FROM Diseases WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}
