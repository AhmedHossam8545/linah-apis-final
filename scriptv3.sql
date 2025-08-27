-- Create Database
CREATE DATABASE IF NOT EXISTS Lina_ManagementV2;
USE Lina_ManagementV2;

-- === Main Reference Tables ===

CREATE TABLE Farms (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    area FLOAT,
    coordinates VARCHAR(100)
);

CREATE TABLE Sectors (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    area FLOAT,
    coordinates VARCHAR(100),
    farmId BINARY(16) NOT NULL,
    FOREIGN KEY (farm_id) REFERENCES Farms(id)
);

CREATE TABLE Blocks (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    area FLOAT,
    coordinates VARCHAR(100),
    sector_id BINARY(16) NOT NULL,
    FOREIGN KEY (sector_id) REFERENCES Sectors(id)
);

CREATE TABLE Wells (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    area FLOAT,
    coordinates VARCHAR(100)
);

CREATE TABLE GuidelinesTasks (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    task TEXT NOT NULL,
    type VARCHAR(100) NOT NULL,
    `order` INT,
    status VARCHAR(50) NOT NULL,
    when_to_act DATETIME NOT NULL
);

-- === Crops and Inventory ===

CREATE TABLE Crops (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    code VARCHAR(50) NOT NULL,
    crop VARCHAR(100) NOT NULL,
    variety VARCHAR(100),
    planted_area FLOAT,
    sector_id BINARY(16) NOT NULL,
    plantation_date DATE NOT NULL,
    harvest_date DATE,
    FOREIGN KEY (sector_id) REFERENCES Sectors(id)
);

CREATE TABLE Inventory (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    code VARCHAR(50) NOT NULL,
    common_name VARCHAR(100) NOT NULL,
    trade_name VARCHAR(100) NOT NULL,
    manufacturing_company VARCHAR(100),
    quantity FLOAT,
    active_ingredient VARCHAR(100),
    measuring_unit VARCHAR(50) NOT NULL,
    price FLOAT,
    type VARCHAR(50) NOT NULL,
    notes TEXT,
    fumagation VARCHAR(100),
    fumagation_cost FLOAT,
    dose_percent FLOAT
);

CREATE TABLE Inventory_logs (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    product_id BINARY(16) NOT NULL,
    log TEXT NOT NULL,
    date DATE NOT NULL,
    number_of_crops_affected INT,
    consumption FLOAT,
    FOREIGN KEY (product_id) REFERENCES Inventory(id)
);

-- === Fertilization ===

CREATE TABLE Fertilization_programs (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    fertilizer VARCHAR(100) NOT NULL,
    dose_per_crop FLOAT NOT NULL,
    dose_per_acre FLOAT NOT NULL,
    total_fertilization_area FLOAT,
    time DATETIME NOT NULL,
    drainage VARCHAR(100),
    crop_fertilized_id BINARY(16) NOT NULL,
    total_crops FLOAT,
    FOREIGN KEY (crop_fertilized_id) REFERENCES Crops(id)
);

CREATE TABLE Fertilization_logs (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    sector_id BINARY(16) NOT NULL,
    crop_id BINARY(16) NOT NULL,
    total_fertilization_area FLOAT,
    total_crops FLOAT,
    dose_used FLOAT NOT NULL,
    dose_not_used FLOAT NOT NULL,
    reason TEXT,
    fertilization_program_id BINARY(16) NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (sector_id) REFERENCES Sectors(id),
    FOREIGN KEY (crop_id) REFERENCES Crops(id),
    FOREIGN KEY (fertilization_program_id) REFERENCES Fertilization_programs(id)
);

CREATE TABLE Fertilization_shifts (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    number_of_crops INT NOT NULL,
    hours FLOAT NOT NULL,
    area FLOAT,
    dose FLOAT,
    fertilization_program_id BINARY(16) NOT NULL,
    FOREIGN KEY (fertilization_program_id) REFERENCES Fertilization_programs(id)
);

-- === Watering ===

CREATE TABLE Watering_programs (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    block_id BINARY(16) NOT NULL,
    well_id BINARY(16) NOT NULL,
    well_drainage_per_m3 FLOAT,
    watering_liter_per_crop FLOAT,
    water_frequency_per_week INT NOT NULL,
    pressure FLOAT,
    FOREIGN KEY (block_id) REFERENCES Blocks(id),
    FOREIGN KEY (well_id) REFERENCES Wells(id)
);

CREATE TABLE Watering_shifts (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    number_of_crops INT NOT NULL,
    hours FLOAT NOT NULL,
    area FLOAT,
    watering_program_id BINARY(16) NOT NULL,
    FOREIGN KEY (watering_program_id) REFERENCES Watering_programs(id)
);

CREATE TABLE Watering_logs (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    watering_program_id BINARY(16) NOT NULL,
    generator_start DATETIME NOT NULL,
    generator_end DATETIME,
    watering_hours FLOAT,
    watering_meter_start FLOAT,
    watering_meter_end FLOAT,
    notes TEXT,
    date DATE NOT NULL,
    FOREIGN KEY (watering_program_id) REFERENCES Watering_programs(id)
);

-- === Rodents, Insects, Weather ===

CREATE TABLE Weather_logs (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    temperature FLOAT NOT NULL,
    wind FLOAT NOT NULL,
    humidity FLOAT NOT NULL
);

CREATE TABLE Rodent_traps (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    code VARCHAR(50) NOT NULL,
    trap_type VARCHAR(50) NOT NULL,
    block_id BINARY(16) NOT NULL,
    FOREIGN KEY (block_id) REFERENCES Blocks(id)
);

CREATE TABLE Rodent_traps_logs (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    trap_id BINARY(16) NOT NULL,
    setup_date DATE NOT NULL,
    trap_health VARCHAR(50) NOT NULL,
    notes TEXT NOT NULL,
    total INT,
    food_percent FLOAT,
    FOREIGN KEY (trap_id) REFERENCES Rodent_traps(id)
);

CREATE TABLE Captured_insects (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    trap_type VARCHAR(50) NOT NULL,
    male INT,
    females INT,
    date DATE NOT NULL,
    insect_type VARCHAR(100)
   -- FOREIGN KEY (trap_id) REFERENCES Rodent_traps(id)
);

CREATE TABLE Insect_traps (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    code VARCHAR(50) NOT NULL,
    trap_id BINARY(16) NOT NULL,
    type VARCHAR(50),
    sector_id BINARY(16) NOT NULL,
    acetate VARCHAR(100),
    FOREIGN KEY (sector_id) REFERENCES Sectors(id),
    FOREIGN KEY (trap_id) REFERENCES Captured_insects(id)
);

CREATE TABLE Insect_traps_logs (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    trap_id BINARY(16) NOT NULL,
    setup_date DATE NOT NULL,
    health VARCHAR(100),
    notes TEXT NOT NULL,
    FOREIGN KEY (trap_id) REFERENCES Insect_traps(id)
);

-- === Pesticides and Fungicides ===

CREATE TABLE Engineers (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE Auditors (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE Workers (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE Machines (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    code VARCHAR(50) NOT NULL,
    type VARCHAR(100) NOT NULL
);

CREATE TABLE Follow_ups (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    log VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    recommendations TEXT
   -- FOREIGN KEY (log_id) REFERENCES Pesticides_logs(id)
);

-- === Pesticides and Fungicides Logs ===

CREATE TABLE Pesticides_logs (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    pest VARCHAR(50) NOT NULL,
    sector_id BINARY(16) NOT NULL,
    date DATE NOT NULL,
    number_of_plants INT NOT NULL,
    crop_id BINARY(16) NOT NULL,
    type VARCHAR(100),
    affected_area FLOAT,
    area_measurement_unit VARCHAR(50),
    affected_crop_part VARCHAR(100),
    purpose VARCHAR(100),
    infection_status VARCHAR(100),
    pesticide_name VARCHAR(100) NOT NULL,
    dose_per_crop_per_cm FLOAT,
    solvent_concentration FLOAT,
    total_solvents_sizes FLOAT,
    dose_used FLOAT,
    dose_measurement_unit VARCHAR(50),
    safety_days VARCHAR(50),
    machine_id BINARY(16) NOT NULL,
    auditor_id BINARY(16) NOT NULL,
    engineer_id BINARY(16) NOT NULL,
    number_of_workers INT,
    detection_date DATE NOT NULL,
    treatment_date DATE,
    finder VARCHAR(100),
    notes TEXT,
    examined_by_id BINARY(16),
    FOREIGN KEY (sector_id) REFERENCES Sectors(id),
    FOREIGN KEY (crop_id) REFERENCES Crops(id),
    FOREIGN KEY (engineer_id) REFERENCES Engineers(id),
    FOREIGN KEY (examined_by_id) REFERENCES Follow_ups(id),
    FOREIGN KEY (machine_id) REFERENCES Machines(id),
    FOREIGN KEY (auditor_id) REFERENCES Auditors(id)
);

CREATE TABLE Fungicides_logs (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    fungus VARCHAR(50) NOT NULL,
    sector_id BINARY(16) NOT NULL,
    date DATE NOT NULL,
    number_of_plants INT NOT NULL,
    crop_id BINARY(16) NOT NULL,
    type VARCHAR(100),
    affected_area FLOAT,
    area_measurement_unit VARCHAR(50),
    affected_crop_part VARCHAR(100),
    purpose VARCHAR(100),
    infection_status VARCHAR(100),
    fungicide_name VARCHAR(100) NOT NULL,
    dose_per_crop_per_cm FLOAT,
    solvent_concentration FLOAT,
    total_solvents_sizes FLOAT,
    dose_used FLOAT,
    dose_measurement_unit VARCHAR(50),
    safety_days VARCHAR(50),
    machine_id BINARY(16) NOT NULL,
    auditor_id BINARY(16) NOT NULL,
    engineer_id BINARY(16) NOT NULL,
    number_of_workers INT,
    detection_date DATE NOT NULL,
    treatment_date DATE,
    finder VARCHAR(100),
    notes TEXT,
    examined_by_id BINARY(16),
    FOREIGN KEY (sector_id) REFERENCES Sectors(id),
    FOREIGN KEY (crop_id) REFERENCES Crops(id),
    FOREIGN KEY (engineer_id) REFERENCES Engineers(id),
    FOREIGN KEY (examined_by_id) REFERENCES Follow_ups(id),
    FOREIGN KEY (machine_id) REFERENCES Machines(id),
    FOREIGN KEY (auditor_id) REFERENCES Auditors(id)
);

-- === Fungi and Pests ===

CREATE TABLE Fungi (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    fungicide_id BINARY(16),
    dose FLOAT,
    infected_crop_id BINARY(16) NOT NULL,
    FOREIGN KEY (infected_crop_id) REFERENCES Crops(id),
    FOREIGN KEY (fungicide_id) REFERENCES Fungicides_logs(id)
);

CREATE TABLE Fungi_logs (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    fungi_id BINARY(16) NOT NULL,
    crop_status TEXT NOT NULL,
    action_status TEXT NOT NULL,
    FOREIGN KEY (fungi_id) REFERENCES Fungi(id)
);

CREATE TABLE Pests (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    pesticide_id BINARY(16) NOT NULL,
    dose FLOAT,
    infected_crop_id BINARY(16) NOT NULL,
    season VARCHAR(100) NOT NULL, 
    FOREIGN KEY (infected_crop_id) REFERENCES Crops(id),
    FOREIGN KEY (pesticide_id) REFERENCES Pesticides_logs(id)
);

CREATE TABLE Pest_logs (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    pest_id BINARY(16) NOT NULL,
    crop_status TEXT NOT NULL,
    action_status TEXT NOT NULL,
    FOREIGN KEY (pest_id) REFERENCES Pests(id)
);

CREATE TABLE Pests_seasons (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    pest_id BINARY(16) NOT NULL,
    season_from DATE NOT NULL,
    season_to DATE NOT NULL,
    FOREIGN KEY (pest_id) REFERENCES Pests(id)
);

CREATE TABLE Diseases (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID(), 1)),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    cause TEXT NOT NULL,
    pest VARCHAR(100),
    pest_id BINARY(16) NOT NULL,
    fungus_id BINARY(16) NOT NULL,
    symptoms TEXT NOT NULL,
    FOREIGN KEY (pest_id) REFERENCES Pests(id),
    FOREIGN KEY (fungus_id) REFERENCES Fungi(id)
);

INSERT INTO Farms (id, code, name, area, coordinates)
VALUES (
    UUID_TO_BIN(UUID()), -- Compact binary UUID
    'FRM002',
    'Sunshine Farm',
    200.75,
    '29.9876, 30.5432'
);


SELECT BIN_TO_UUID(id) AS id, code, name FROM Farms;
