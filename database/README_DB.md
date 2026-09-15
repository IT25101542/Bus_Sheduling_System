# Lanka Transit Services - Database Setup Guide

This database directory contains the complete relational schema and sample seed data for Lanka Transit Services (Pvt) Ltd.

## Files
1. `schema.sql`: Contains DDL table definitions with foreign keys, indexes, and constraints.
2. `data.sql`: Contains rich initial seed data for all 6 university modules and pre-configured user credentials.

## Setup Options

### Option A: Using MySQL Command Line
```bash
mysql -u root -p < schema.sql
mysql -u root -p lanka_transit_db < data.sql
```

### Option B: Using MySQL Workbench
1. Open MySQL Workbench and connect to your local MySQL instance.
2. Go to **File -> Open SQL Script...** and select `schema.sql`.
3. Click the Execute button (lightning icon) to create database and tables.
4. Open `data.sql` and execute to populate seed data.

### Option C: Using XAMPP / phpMyAdmin
1. Open XAMPP Control Panel and start MySQL.
2. Navigate to `http://localhost/phpmyadmin`.
3. Click the **Import** tab.
4. Choose `schema.sql` and click **Import**.
5. Choose `data.sql` and click **Import**.

### Note on Spring Boot Auto-Initialization
When you run the Spring Boot backend (`/backend`), it is configured by default to automatically create tables via Hibernate and load initial seed data through `DataInitializer.java`. You do not need to execute these scripts manually unless resetting the database!
