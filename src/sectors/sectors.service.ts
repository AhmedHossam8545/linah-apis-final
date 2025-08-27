import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SectorService {
  constructor(private readonly dataSource: DataSource) {}  

  // Creates a new sector record with code, name, area and coordinates
  async create(dto: CreateSectorDto) {
    const id = uuidv4();
    dto.id = id;
    await this.dataSource.query(
      `INSERT INTO Sectors (code, name, area, coordinates, farm_id, id) VALUES (?, ?, ?, ?, UUID_TO_BIN(?), UUID_TO_BIN(?))`,
      [dto.code, dto.name, dto.area, dto.coordinates, dto.farm_id, id],
    );
    return this.findOne(id);
  }

  // Retrieves all sector records from the database
  async findAll() {
    const rows = await this.dataSource.query( `SELECT
       BIN_TO_UUID(s.id) as id, 
       s.code, 
       s.name, 
       s.area, 
       s.coordinates,
       JSON_OBJECT(
         'id', BIN_TO_UUID(farm_id),
         'code', farm.code,
         'name', farm.name,
         'area', farm.area,
         'coordinates', farm.coordinates
       ) as farm 
       FROM Sectors s
       JOIN Farms farm ON s.farm_id = farm.id
       ORDER BY s.name ASC`);
    return rows .map(r => ({
      ...r,
      farm: typeof r.farm === 'string' ? JSON.parse(r.farm) : r.farm
    }));
  }

  // Finds a specific sector record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `SELECT
       BIN_TO_UUID(s.id) as id, 
       s.code, 
       s.name, 
       s.area, 
       s.coordinates,
       JSON_OBJECT(
         'id', BIN_TO_UUID(farm_id),
         'code', farm.code,
         'name', farm.name,
         'area', farm.area,
         'coordinates', farm.coordinates
       ) as farm 
       FROM Sectors s
       JOIN Farms farm ON s.farm_id = farm.id 
       WHERE s.id = UUID_TO_BIN(?)
       LIMIT 1`,
      [id],
    );
    if (!rows.length) throw new NotFoundException('Sectors not found');
    return{
      ...rows[0],
      farm: typeof rows[0].farm === 'string' ? JSON.parse(rows[0].farm) : rows[0].farm
    }
  }

  // Updates an existing sector record with new information
  async update(id: string, dto: UpdateSectorDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.code !== undefined) { fields.push('code = ?'); values.push(dto.code); }
    if (dto.name !== undefined) { fields.push('name = ?'); values.push(dto.name); }
    if (dto.area !== undefined) { fields.push('area = ?'); values.push(dto.area); }
    if (dto.coordinates !== undefined) { fields.push('coordinates = ?'); values.push(dto.coordinates); }
    if (dto.farm_id !== undefined) { fields.push('farm_id = ?'); values.push(dto.farm_id); }
   
    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE Sectors SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }

  // Deletes a sector record from the database
  async remove(id: string) {
    await this.dataSource.query(
      `DELETE FROM Sectors WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}
