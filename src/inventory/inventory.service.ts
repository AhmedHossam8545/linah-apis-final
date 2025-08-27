import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InventoryService {
  constructor(private readonly dataSource: DataSource) {}

  // Creates a new inventory record with item details and stock information
  async create(dto: CreateInventoryDto) {
    const id = uuidv4();    dto.id = id;    await this.dataSource.query(
      `INSERT INTO Inventory (id, code, common_name, trade_name, manufacturing_company, quantity, active_ingredient, measuring_unit, price, type, notes, fumagation, fumagation_cost, dose_percent) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, dto.code, dto.common_name, dto.trade_name, dto.manufacturing_company, dto.quantity, dto.active_ingredient, dto.measuring_unit, dto.price, dto.type, dto.notes, dto.fumagation, dto.fumagation_cost, dto.dose_percent],
    );
    return this.findOne(id);
  }

  // Retrieves all inventory records from the database
  async findAll() {
    return this.dataSource.query(`SELECT BIN_TO_UUID(id) as id, code, common_name, trade_name, manufacturing_company, quantity, active_ingredient, measuring_unit, price, type, notes, fumagation, fumagation_cost, dose_percent FROM Inventory`);
  }

  // Finds a specific inventory record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `SELECT BIN_TO_UUID(id) as id, code, common_name, trade_name, manufacturing_company, quantity, active_ingredient, measuring_unit, price, type, notes, fumagation, fumagation_cost, dose_percent FROM Inventory WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    if (!rows.length) throw new NotFoundException('Inventory not found');
    return rows[0];
  }



    // Updates an existing inventory record with new stock or item data
  async update(id: string, dto: UpdateInventoryDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.code !== undefined) { fields.push('code = ?'); values.push(dto.code); }
    if (dto.common_name !== undefined) { fields.push('common_name = ?'); values.push(dto.common_name); }
    if (dto.trade_name !== undefined) { fields.push('trade_name = ?'); values.push(dto.trade_name); }
    if (dto.manufacturing_company !== undefined) { fields.push('manufacturing_company = ?'); values.push(dto.manufacturing_company); }
    if (dto.quantity !== undefined) { fields.push('quantity = ?'); values.push(dto.quantity); }
    if (dto.active_ingredient !== undefined) { fields.push('active_ingredient = ?'); values.push(dto.active_ingredient); }
    if (dto.measuring_unit !== undefined) { fields.push('measuring_unit = ?'); values.push(dto.measuring_unit); }
    if (dto.price !== undefined) { fields.push('price = ?'); values.push(dto.price); }
    if (dto.type !== undefined) { fields.push('type = ?'); values.push(dto.type); }
    if (dto.notes !== undefined) { fields.push('notes = ?'); values.push(dto.notes); }
    if (dto.fumagation !== undefined) { fields.push('fumagation = ?'); values.push(dto.fumagation); }
    if (dto.fumagation_cost !== undefined) { fields.push('fumagation_cost = ?'); values.push(dto.fumagation_cost); }
    if (dto.dose_percent !== undefined) { fields.push('dose_percent = ?'); values.push(dto.dose_percent); }

    
    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE Inventory SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }

  // Deletes an inventory record from the database
  async remove(id: string) {
    await this.dataSource.query(
      `DELETE FROM Inventory WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}

