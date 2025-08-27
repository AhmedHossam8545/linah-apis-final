# Lina Management NestJS Modules

This folder contains one NestJS module per table from `scriptv3.sql`,
following the same style as the provided `farms` example (raw SQL via DataSource,
UUID v4 strings converted with `UUID_TO_BIN(..., 1)` / `BIN_TO_UUID(...)`).

## How to use

1. Copy the folders in this directory into your NestJS `src/` directory.
2. Add `LinaManagementModule` (from `lina-management.module.ts`) to your root `AppModule` imports.
3. Ensure your TypeORM `DataSource` is configured for MySQL and available via DI.
4. Endpoints are registered using the table names as paths (e.g., `/farms`, `/sectors`, `/blocks`, ...).

## Notes

- Create DTOs require foreign key UUIDs as strings; services will convert them
  to `BINARY(16)` with `UUID_TO_BIN(?, 1)` when writing, and return UUID strings with `BIN_TO_UUID` when reading.
- Update endpoints accept partial bodies and only update provided fields.
- You can extend validation rules in DTOs as needed.
