import { FarmsModule } from './farms/farms.module';
import { SectorModule } from './sectors/sectors.module';
import { BlockModule } from './blocks/blocks.module';
import { WellModule } from './wells/wells.module';
import { GuidelinesTaskModule } from './guidelinestasks/guidelinestasks.module';
import { CropModule } from './crops/crops.module';
import { InventoryModule } from './inventory/inventory.module';
import { Inventory_logModule } from './inventory_logs/inventory_logs.module';
import { Fertilization_programModule } from './fertilization_programs/fertilization_programs.module';
import { Fertilization_logModule } from './fertilization_logs/fertilization_logs.module';
import { Fertilization_shiftModule } from './fertilization_shifts/fertilization_shifts.module';
import { Watering_programModule } from './watering_programs/watering_programs.module';
import { Watering_shiftModule } from './watering_shifts/watering_shifts.module';
import { Watering_logModule } from './watering_logs/watering_logs.module';
import { Weather_logModule } from './weather_logs/weather_logs.module';
import { Rodent_trapModule } from './rodent_traps/rodent_traps.module';
import { Rodent_traps_logModule } from './rodent_traps_logs/rodent_traps_logs.module';
import { CapturedInsectModule } from './captured_insects/captured_insects.module';
import { Insect_trapModule } from './insect_traps/insect_traps.module';
import { Insect_traps_logModule } from './insect_traps_logs/insect_traps_logs.module';
import { EngineerModule } from './engineers/engineers.module';
import { AuditorModule } from './auditors/auditors.module';
import { WorkerModule } from './workers/workers.module';
import { MachineModule } from './machines/machines.module';
import { Follow_upModule } from './follow_ups/follow_ups.module';
import { Pesticides_logModule } from './pesticides_logs/pesticides_logs.module';
import { Fungicides_logModule } from './fungicides_logs/fungicides_logs.module';
import { FungiModule } from './fungi/fungi.module';
import { Fungi_logModule } from './fungi_logs/fungi_logs.module';
import { PestModule } from './pests/pests.module';
import { Pest_logModule } from './pest_logs/pest_logs.module';
import { Pests_seasonModule } from './pests_seasons/pests_seasons.module';
import { DiseaseModule } from './diseases/diseases.module';

import { Module } from '@nestjs/common';

@Module({
  imports: [
  FarmsModule,
  SectorModule,
  BlockModule,
  WellModule,
  GuidelinesTaskModule,
  CropModule,
  InventoryModule,
  Inventory_logModule,
  Fertilization_programModule,
  Fertilization_logModule,
  Fertilization_shiftModule,
  Watering_programModule,
  Watering_shiftModule,
  Watering_logModule,
  Weather_logModule,
  Rodent_trapModule,
  Rodent_traps_logModule,
  CapturedInsectModule,
  Insect_trapModule,
  Insect_traps_logModule,
  EngineerModule,
  AuditorModule,
  WorkerModule,
  MachineModule,
  Follow_upModule,
  Pesticides_logModule,
  Fungicides_logModule,
  FungiModule,
  Fungi_logModule,
  PestModule,
  Pest_logModule,
  Pests_seasonModule,
  DiseaseModule
  ],
  exports: [
  FarmsModule,
  SectorModule,
  BlockModule,
  WellModule,
  GuidelinesTaskModule,
  CropModule,
  InventoryModule,
  Inventory_logModule,
  Fertilization_programModule,
  Fertilization_logModule,
  Fertilization_shiftModule,
  Watering_programModule,
  Watering_shiftModule,
  Watering_logModule,
  Weather_logModule,
  Rodent_trapModule,
  Rodent_traps_logModule,
  CapturedInsectModule,
  Insect_trapModule,
  Insect_traps_logModule,
  EngineerModule,
  AuditorModule,
  WorkerModule,
  MachineModule,
  Follow_upModule,
  Pesticides_logModule,
  Fungicides_logModule,
  FungiModule,
  Fungi_logModule,
  PestModule,
  Pest_logModule,
  Pests_seasonModule,
  DiseaseModule
  ]
})
export class LinaManagementModule {}