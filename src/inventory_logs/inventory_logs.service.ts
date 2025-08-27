import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateInventory_logDto } from './dto/create-inventory_log.dto';
import { UpdateInventory_logDto } from './dto/update-inventory_log.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class Inventory_logService {
  constructor(private readonly dataSource: DataSource) {}

  // Creates a new inventory log record with transaction details and stock changes
  async create(dto: CreateInventory_logDto) {
    const id = uuidv4();    dto.id = id;    await this.dataSource.query(
      `INSERT INTO Inventory_logs (id, product_id, log, date, number_of_crops_affected, consumption) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?, ?, ?)`,
      [id, dto.product_id, dto.log, dto.date, dto.number_of_crops_affected, dto.consumption],
    );
    return this.findOne(id);
  }

  // Retrieves all inventory log records from the database
  async findAll() {
    const rows = await this.dataSource.query(`
      SELECT 
        BIN_TO_UUID(i.id) as id,
        i.log,
        i.date,
        i.number_of_crops_affected,
        i.consumption,
        JSON_OBJECT(
          'id', BIN_TO_UUID(il.id),
          'code', il.code,
          'common_name', il.common_name,
          'trade_name', il.trade_name,
          'manufacturing_company', il.manufacturing_company,
          'quantity', il.quantity,
          'active_ingredient', il.active_ingredient,
          'measuring_unit', il.measuring_unit,
          'price', il.price,
          'type', il.type,
          'notes', il.notes,
          'fumagation', il.fumagation,
          'fumagation_cost', il.fumagation_cost,
          'dose_percent', il.dose_percent
        ) as inventory
      FROM Inventory_logs i
      JOIN Inventory il ON i.product_id = il.id
    `);
  
    return rows.map(r => ({
      ...r,
      inventory: typeof r.inventory === 'string' ? JSON.parse(r.inventory) : r.inventory
    }));
    
  }



  // Finds a specific inventory log record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `SELECT 
        BIN_TO_UUID(i.id) as id,
        i.log,
        i.date,
        i.number_of_crops_affected,
        i.consumption,
        JSON_OBJECT(
          'id', BIN_TO_UUID(il.id),
          'code', il.code,
          'common_name', il.common_name,
          'trade_name', il.trade_name,
          'manufacturing_company', il.manufacturing_company,
          'quantity', il.quantity,
          'active_ingredient', il.active_ingredient,
          'measuring_unit', il.measuring_unit,
          'price', il.price,
          'type', il.type,
          'notes', il.notes,
          'fumagation', il.fumagation,
          'fumagation_cost', il.fumagation_cost,
          'dose_percent', il.dose_percent
        ) as inventory
      FROM Inventory_logs i
      JOIN Inventory il ON i.product_id = il.id
       WHERE i.id = UUID_TO_BIN(?)
       LIMIT 1`,
      [id],
    );
    if (!rows.length) throw new NotFoundException('Inventory_logs not found');
    return {
      ...rows[0],
      inventory: typeof rows[0].inventory === 'string' ? JSON.parse(rows[0].inventory) : rows[0].inventory
    }
  }



    // Updates an existing inventory log record with new transaction data
  async update(id: string, dto: UpdateInventory_logDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.product_id !== undefined) { fields.push('product_id = ?'); values.push(dto.product_id); }
    if (dto.log !== undefined) { fields.push('log = ?'); values.push(dto.log); }
    if (dto.date !== undefined) { fields.push('date = ?'); values.push(dto.date); }
    if (dto.number_of_crops_affected !== undefined) { fields.push('number_of_crops_affected = ?'); values.push(dto.number_of_crops_affected); }
    if (dto.consumption !== undefined) { fields.push('consumption = ?'); values.push(dto.consumption); }

    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE Inventory_logs SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }

  // Deletes an inventory log record from the database
  async remove(id: string) {
    await this.dataSource.query(
      `DELETE FROM Inventory_logs WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}

