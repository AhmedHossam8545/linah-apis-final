import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreatePesticides_logDto } from './dto/create-pesticides_log.dto';
import { UpdatePesticides_logDto } from './dto/update-pesticides_log.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class Pesticides_logService {
  constructor(private readonly dataSource: DataSource) {}  

  // Creates a new pesticides log record with application data and treatment information
  async create(dto: CreatePesticides_logDto) {
    const id = uuidv4();
    dto.id = id;
    await this.dataSource.query(
      `INSERT INTO Pesticides_logs (id, pest, sector_id, date, number_of_plants, crop_id, type, affected_area, area_measurement_unit, affected_crop_part, purpose, infection_status, pesticide_name, dose_per_crop_per_cm, solvent_concentration, total_solvents_sizes, dose_used, dose_measurement_unit, safety_days, machine_id, auditor_id, engineer_id, number_of_workers, detection_date, treatment_date, finder, notes, examined_by_id) VALUES (UUID_TO_BIN(?), ?, UUID_TO_BIN(?), ?, ?, UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, UUID_TO_BIN(?), UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?, ?, ?, ?, UUID_TO_BIN(?))`,
      [id, dto.pest, dto.sector_id, dto.date, dto.number_of_plants, dto.crop_id, dto.type, dto.affected_area, dto.area_measurement_unit, dto.affected_crop_part, dto.purpose, dto.infection_status, dto.pesticide_name, dto.dose_per_crop_per_cm, dto.solvent_concentration, dto.total_solvents_sizes, dto.dose_used, dto.dose_measurement_unit, dto.safety_days, dto.machine_id, dto.auditor_id, dto.engineer_id, dto.number_of_workers, dto.detection_date, dto.treatment_date, dto.finder, dto.notes, dto.examined_by_id],
    );
    return this.findOne(id);
  }

  // Retrieves all pesticides log records from the database
  async findAll() {
    const rows = await this.dataSource.query(`SELECT 
      BIN_TO_UUID(pl.id) as id,
      pl.pest,
      JSON_OBJECT(
        'id', BIN_TO_UUID(s.id),
        'code', s.code,
        'name', s.name,
        'area', s.area,
        'coordinates', s.coordinates,
        'farm', JSON_OBJECT(
          'id', BIN_TO_UUID(f.id),
          'code', f.code,
          'name', f.name,
          'area', f.area,
          'coordinates', f.coordinates
        )
      ) as sector,
      pl.date,
      pl.number_of_plants,
      JSON_OBJECT(
        'id', BIN_TO_UUID(c.id),
        'code', c.code,
        'crop', c.crop,
        'variety', c.variety,
        'planted_area', c.planted_area,
        'plantation_date', c.plantation_date,
        'harvest_date', c.harvest_date
      ) as crop,
      pl.type,
      pl.affected_area,
      pl.area_measurement_unit,
      pl.affected_crop_part,
      pl.purpose,
      pl.infection_status,
      pl.pesticide_name,
      pl.dose_per_crop_per_cm,
      pl.solvent_concentration,
      pl.total_solvents_sizes,
      pl.dose_used,
      pl.dose_measurement_unit,
      pl.safety_days,
      JSON_OBJECT(
        'id', BIN_TO_UUID(m.id),
        'code', m.code,
        'type', m.type
      ) as machine,
      JSON_OBJECT(
        'id', BIN_TO_UUID(a.id),
        'code', a.code,
        'name', a.name
      ) as auditor,
      JSON_OBJECT(
        'id', BIN_TO_UUID(e.id),
        'code', e.code,
        'name', e.name
      ) as engineer,
      pl.number_of_workers,
      pl.detection_date,
      pl.treatment_date,
      pl.finder,
      pl.notes,
      JSON_OBJECT(
        'id', BIN_TO_UUID(fu.id),
        'log', fu.log,
        'date', fu.date,
        'recommendations', fu.recommendations
      ) as examined_by
      FROM Pesticides_logs pl
      JOIN Sectors s ON pl.sector_id = s.id
      JOIN Farms f ON s.farm_id = f.id
      JOIN Crops c ON pl.crop_id = c.id
      JOIN Machines m ON pl.machine_id = m.id
      JOIN Auditors a ON pl.auditor_id = a.id
      JOIN Engineers e ON pl.engineer_id = e.id
      LEFT JOIN Follow_ups fu ON pl.examined_by_id = fu.id
      ORDER BY pl.date DESC`);
    return rows.map(r => ({
      ...r,
      sector: typeof r.sector === 'string' ? JSON.parse(r.sector) : r.sector,
      crop: typeof r.crop === 'string' ? JSON.parse(r.crop) : r.crop,
      machine: typeof r.machine === 'string' ? JSON.parse(r.machine) : r.machine,
      auditor: typeof r.auditor === 'string' ? JSON.parse(r.auditor) : r.auditor,
      engineer: typeof r.engineer === 'string' ? JSON.parse(r.engineer) : r.engineer,
      examined_by: typeof r.examined_by === 'string' ? JSON.parse(r.examined_by) : r.examined_by
    }));
  }

  // Finds a specific pesticides log record by its unique ID
  async findOne(id: string) {
    const rows = await this.dataSource.query(
      `SELECT 
      BIN_TO_UUID(pl.id) as id,
      pl.pest,
      JSON_OBJECT(
        'id', BIN_TO_UUID(s.id),
        'code', s.code,
        'name', s.name,
        'area', s.area,
        'coordinates', s.coordinates,
        'farm', JSON_OBJECT(
          'id', BIN_TO_UUID(f.id),
          'code', f.code,
          'name', f.name,
          'area', f.area,
          'coordinates', f.coordinates
        )
      ) as sector,
      pl.date,
      pl.number_of_plants,
      JSON_OBJECT(
        'id', BIN_TO_UUID(c.id),
        'code', c.code,
        'crop', c.crop,
        'variety', c.variety,
        'planted_area', c.planted_area,
        'plantation_date', c.plantation_date,
        'harvest_date', c.harvest_date
      ) as crop,
      pl.type,
      pl.affected_area,
      pl.area_measurement_unit,
      pl.affected_crop_part,
      pl.purpose,
      pl.infection_status,
      pl.pesticide_name,
      pl.dose_per_crop_per_cm,
      pl.solvent_concentration,
      pl.total_solvents_sizes,
      pl.dose_used,
      pl.dose_measurement_unit,
      pl.safety_days,
      JSON_OBJECT(
        'id', BIN_TO_UUID(m.id),
        'code', m.code,
        'type', m.type
      ) as machine,
      JSON_OBJECT(
        'id', BIN_TO_UUID(a.id),
        'code', a.code,
        'name', a.name
      ) as auditor,
      JSON_OBJECT(
        'id', BIN_TO_UUID(e.id),
        'code', e.code,
        'name', e.name
      ) as engineer,
      pl.number_of_workers,
      pl.detection_date,
      pl.treatment_date,
      pl.finder,
      pl.notes,
      JSON_OBJECT(
        'id', BIN_TO_UUID(fu.id),
        'log', fu.log,
        'date', fu.date,
        'recommendations', fu.recommendations
      ) as examined_by
      FROM Pesticides_logs pl
      JOIN Sectors s ON pl.sector_id = s.id
      JOIN Farms f ON s.farm_id = f.id
      JOIN Crops c ON pl.crop_id = c.id
      JOIN Machines m ON pl.machine_id = m.id
      JOIN Auditors a ON pl.auditor_id = a.id
      JOIN Engineers e ON pl.engineer_id = e.id
      LEFT JOIN Follow_ups fu ON pl.examined_by_id = fu.id
      WHERE pl.id = UUID_TO_BIN(?)`,
      [id],
    );
    if (!rows.length) throw new NotFoundException('Pesticides_logs not found');
    return {
      ...rows[0],
      sector: typeof rows[0].sector === 'string' ? JSON.parse(rows[0].sector) : rows[0].sector,
      crop: typeof rows[0].crop === 'string' ? JSON.parse(rows[0].crop) : rows[0].crop,
      machine: typeof rows[0].machine === 'string' ? JSON.parse(rows[0].machine) : rows[0].machine,
      auditor: typeof rows[0].auditor === 'string' ? JSON.parse(rows[0].auditor) : rows[0].auditor,
      engineer: typeof rows[0].engineer === 'string' ? JSON.parse(rows[0].engineer) : rows[0].engineer,
      examined_by: typeof rows[0].examined_by === 'string' ? JSON.parse(rows[0].examined_by) : rows[0].examined_by
    };
  }

  


    // Updates an existing pesticides log record with new application data
  async update(id: string, dto: UpdatePesticides_logDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (dto.pest !== undefined) { fields.push('pest = ?'); values.push(dto.pest); }
    if (dto.sector_id !== undefined) { fields.push('sector_id = UUID_TO_BIN(?)'); values.push(dto.sector_id); }
    if (dto.date !== undefined) { fields.push('date = ?'); values.push(dto.date); }
    if (dto.number_of_plants !== undefined) { fields.push('number_of_plants = ?'); values.push(dto.number_of_plants); }
    if (dto.crop_id !== undefined) { fields.push('crop_id = UUID_TO_BIN(?)'); values.push(dto.crop_id); }
    if (dto.type !== undefined) { fields.push('type = ?'); values.push(dto.type); }
    if (dto.affected_area !== undefined) { fields.push('affected_area = ?'); values.push(dto.affected_area); }
    if (dto.area_measurement_unit !== undefined) { fields.push('area_measurement_unit = ?'); values.push(dto.area_measurement_unit); }
    if (dto.affected_crop_part !== undefined) { fields.push('affected_crop_part = ?'); values.push(dto.affected_crop_part); }
    if (dto.purpose !== undefined) { fields.push('purpose = ?'); values.push(dto.purpose); }
    if (dto.infection_status !== undefined) { fields.push('infection_status = ?'); values.push(dto.infection_status); }
    if (dto.pesticide_name !== undefined) { fields.push('pesticide_name = ?'); values.push(dto.pesticide_name); }
    if (dto.dose_per_crop_per_cm !== undefined) { fields.push('dose_per_crop_per_cm = ?'); values.push(dto.dose_per_crop_per_cm); }
    if (dto.solvent_concentration !== undefined) { fields.push('solvent_concentration = ?'); values.push(dto.solvent_concentration); }
    if (dto.total_solvents_sizes !== undefined) { fields.push('total_solvents_sizes = ?'); values.push(dto.total_solvents_sizes); }
    if (dto.dose_used !== undefined) { fields.push('dose_used = ?'); values.push(dto.dose_used); }
    if (dto.dose_measurement_unit !== undefined) { fields.push('dose_measurement_unit = ?'); values.push(dto.dose_measurement_unit); }
    if (dto.safety_days !== undefined) { fields.push('safety_days = ?'); values.push(dto.safety_days); }
    if (dto.machine_id !== undefined) { fields.push('machine_id = UUID_TO_BIN(?)'); values.push(dto.machine_id); }
    if (dto.auditor_id !== undefined) { fields.push('auditor_id = UUID_TO_BIN(?)'); values.push(dto.auditor_id); }
    if (dto.engineer_id !== undefined) { fields.push('engineer_id = UUID_TO_BIN(?)'); values.push(dto.engineer_id); }
    if (dto.number_of_workers !== undefined) { fields.push('number_of_workers = ?'); values.push(dto.number_of_workers); }
    if (dto.detection_date !== undefined) { fields.push('detection_date = ?'); values.push(dto.detection_date); }
    if (dto.treatment_date !== undefined) { fields.push('treatment_date = ?'); values.push(dto.treatment_date); }
    if (dto.finder !== undefined) { fields.push('finder = ?'); values.push(dto.finder); }
    if (dto.notes !== undefined) { fields.push('notes = ?'); values.push(dto.notes); }
    if (dto.examined_by_id !== undefined) { fields.push('examined_by_id = UUID_TO_BIN(?)'); values.push(dto.examined_by_id); }
    
    if (fields.length === 0) return this.findOne(id);

    values.push(id);
    await this.dataSource.query(
      `UPDATE Pesticides_logs SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?)`,
      values,
    );
    return this.findOne(id);
  }

  // Deletes a pesticides log record from the database
  async remove(id: string) {
    await this.dataSource.query(
      `DELETE FROM Pesticides_logs WHERE id = UUID_TO_BIN(?)`,
      [id],
    );
    return { deleted: true };
  }
}

