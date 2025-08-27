import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class FarmsService {
  constructor(private readonly dataSource: DataSource) {}



    // Creates a new farm record with code, name, area and coordinates
    async create(dto: CreateFarmDto) {
        const id = uuidv4();
        dto.id = id;
        try {

        await this.dataSource.query(
            `INSERT INTO Farms (id, code, name, area, coordinates) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?)`,
            [id, dto.code, dto.name, dto.area ?? null, dto.coordinates ?? null],
          );
        return { ...dto };
        } catch (err) {
        console.error('DB ERROR:', err); 
        throw err;
        }
    }



  // Retrieves all farm records from the database
  async findAll() {
    return this.dataSource.query(
      `SELECT BIN_TO_UUID(id) as id, code, name, area, coordinates
       FROM Farms
       ORDER BY name ASC`
    );
  }

  // Finds a specific farm record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `SELECT BIN_TO_UUID(id) as id, code, name, area, coordinates
       FROM Farms
       WHERE id = UUID_TO_BIN(?)
       LIMIT 1`,
      [id],
    );
    if (!rows[0]) throw new NotFoundException('Farm not found');
    return rows[0];
  }

  // Updates an existing farm record with new data
  async update(id: string, dto: UpdateFarmDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.code !== undefined) { fields.push('code = ?'); values.push(dto.code); }
    if (dto.name !== undefined) { fields.push('name = ?'); values.push(dto.name); }
    if (dto.area !== undefined) { fields.push('area = ?'); values.push(dto.area); }
    if (dto.coordinates !== undefined) { fields.push('coordinates = ?'); values.push(dto.coordinates); }

    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE Farms SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }

  // Deletes a farm record from the database
  async remove(id: string) {
    const res = await this.dataSource.query(
      `DELETE FROM Farms WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}
