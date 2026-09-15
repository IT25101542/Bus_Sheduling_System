-- ==========================================================
-- Lanka Transit Services (Pvt) Ltd
-- Web-Based Bus Scheduling & Booking System
-- Normalized MySQL Relational Database Schema
-- Year 2 University Software Engineering Project
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `lanka_transit_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `lanka_transit_db`;

SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------
-- 1. AUTHENTICATION & USERS (SHARED)
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(60) NOT NULL UNIQUE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(120) NOT NULL,
    `phone` VARCHAR(20),
    `role` VARCHAR(40) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL UNIQUE,
    `nic` VARCHAR(20) NOT NULL,
    `address` VARCHAR(255),
    `membership_tier` VARCHAR(30) DEFAULT 'BRONZE',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_customer_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 2. MEMBER 1: TRIP PLANNING & SCHEDULING (IT25100270)
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `buses`;
CREATE TABLE `buses` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `bus_number` VARCHAR(30) NOT NULL UNIQUE,
    `registration_number` VARCHAR(30) NOT NULL UNIQUE,
    `capacity` INT NOT NULL DEFAULT 40,
    `bus_type` VARCHAR(30) NOT NULL DEFAULT 'LUXURY_AC', -- LUXURY_AC, SEMI_LUXURY, STANDARD, HIGHWAY_EXPRESS
    `status` VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',      -- ACTIVE, MAINTENANCE, INACTIVE
    `depot_location` VARCHAR(80) NOT NULL DEFAULT 'Colombo Fort Depot',
    `air_conditioned` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `drivers`;
CREATE TABLE `drivers` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `driver_code` VARCHAR(30) NOT NULL UNIQUE,
    `full_name` VARCHAR(120) NOT NULL,
    `license_number` VARCHAR(40) NOT NULL UNIQUE,
    `phone` VARCHAR(20) NOT NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',   -- AVAILABLE, ON_TRIP, ON_LEAVE
    `assigned_depot` VARCHAR(80) NOT NULL DEFAULT 'Colombo Fort Depot',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `routes`;
CREATE TABLE `routes` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `route_number` VARCHAR(30) NOT NULL UNIQUE,
    `origin` VARCHAR(80) NOT NULL,
    `destination` VARCHAR(80) NOT NULL,
    `distance_km` DOUBLE NOT NULL,
    `estimated_duration_mins` INT NOT NULL,
    `base_fare` DOUBLE NOT NULL,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `route_stops`;
CREATE TABLE `route_stops` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `route_id` BIGINT NOT NULL,
    `stop_name` VARCHAR(80) NOT NULL,
    `stop_order` INT NOT NULL,
    `distance_from_origin_km` DOUBLE NOT NULL,
    CONSTRAINT `fk_stop_route` FOREIGN KEY (`route_id`) REFERENCES `routes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `schedules`;
CREATE TABLE `schedules` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `schedule_code` VARCHAR(30) NOT NULL UNIQUE,
    `route_id` BIGINT NOT NULL,
    `bus_id` BIGINT NOT NULL,
    `driver_id` BIGINT NOT NULL,
    `departure_time` VARCHAR(10) NOT NULL,   -- e.g. "06:30"
    `arrival_time` VARCHAR(10) NOT NULL,     -- e.g. "10:00"
    `frequency` VARCHAR(30) DEFAULT 'DAILY', -- DAILY, WEEKDAYS, WEEKENDS
    `status` VARCHAR(30) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, SUSPENDED, CANCELLED
    `effective_from` DATE,
    `effective_to` DATE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_sched_route` FOREIGN KEY (`route_id`) REFERENCES `routes` (`id`),
    CONSTRAINT `fk_sched_bus` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`),
    CONSTRAINT `fk_sched_driver` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `delay_logs`;
CREATE TABLE `delay_logs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `schedule_id` BIGINT NOT NULL,
    `delay_minutes` INT NOT NULL,
    `delay_reason` VARCHAR(255) NOT NULL,
    `updated_departure_time` VARCHAR(10),
    `reported_by` VARCHAR(80) DEFAULT 'Depot Supervisor',
    `reported_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_delay_sched` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 3. MEMBER 2: RESERVATION MANAGEMENT (IT25101542)
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `trips`;
CREATE TABLE `trips` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `trip_code` VARCHAR(40) NOT NULL UNIQUE,
    `schedule_id` BIGINT NOT NULL,
    `route_id` BIGINT NOT NULL,
    `bus_id` BIGINT NOT NULL,
    `driver_id` BIGINT NOT NULL,
    `trip_date` DATE NOT NULL,
    `departure_time` VARCHAR(10) NOT NULL,
    `arrival_time` VARCHAR(10) NOT NULL,
    `fare_amount` DOUBLE NOT NULL,
    `total_seats` INT NOT NULL DEFAULT 40,
    `available_seats` INT NOT NULL DEFAULT 40,
    `status` VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED', -- SCHEDULED, BOARDING, IN_TRANSIT, COMPLETED, CANCELLED
    CONSTRAINT `fk_trip_sched` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`),
    CONSTRAINT `fk_trip_route` FOREIGN KEY (`route_id`) REFERENCES `routes` (`id`),
    CONSTRAINT `fk_trip_bus` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`),
    CONSTRAINT `fk_trip_driver` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `seats`;
CREATE TABLE `seats` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `trip_id` BIGINT NOT NULL,
    `seat_number` VARCHAR(10) NOT NULL,
    `seat_status` VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE', -- AVAILABLE, BOOKED, RESERVED
    `passenger_name` VARCHAR(120),
    `passenger_gender` VARCHAR(10),
    CONSTRAINT `fk_seat_trip` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE CASCADE,
    UNIQUE KEY `uk_trip_seat` (`trip_id`, `seat_number`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `reservations`;
CREATE TABLE `reservations` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `booking_reference` VARCHAR(40) NOT NULL UNIQUE,
    `trip_id` BIGINT NOT NULL,
    `customer_id` BIGINT,
    `passenger_name` VARCHAR(120) NOT NULL,
    `passenger_phone` VARCHAR(20) NOT NULL,
    `passenger_nic` VARCHAR(20),
    `seat_number` VARCHAR(10) NOT NULL,
    `total_amount` DOUBLE NOT NULL,
    `reservation_status` VARCHAR(30) NOT NULL DEFAULT 'CONFIRMED', -- CONFIRMED, CANCELLED, MODIFIED
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_res_trip` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`),
    CONSTRAINT `fk_res_cust` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `waiting_list`;
CREATE TABLE `waiting_list` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `trip_id` BIGINT NOT NULL,
    `customer_id` BIGINT,
    `passenger_name` VARCHAR(120) NOT NULL,
    `contact_phone` VARCHAR(20) NOT NULL,
    `requested_seats` INT DEFAULT 1,
    `status` VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- PENDING, ALLOCATED, CANCELLED
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_wl_trip` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_wl_cust` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 4. MEMBER 3: TICKETING & FARE MANAGEMENT (IT25103360)
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `fare_rules`;
CREATE TABLE `fare_rules` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `rule_name` VARCHAR(100) NOT NULL,
    `route_id` BIGINT,
    `passenger_type` VARCHAR(30) NOT NULL DEFAULT 'ADULT', -- ADULT, CHILD, STUDENT, SENIOR
    `bus_type` VARCHAR(30) NOT NULL DEFAULT 'LUXURY_AC',
    `base_price` DOUBLE NOT NULL,
    `per_km_rate` DOUBLE NOT NULL,
    `discount_percentage` DOUBLE DEFAULT 0.0,
    `is_active` BOOLEAN DEFAULT TRUE,
    CONSTRAINT `fk_fare_route` FOREIGN KEY (`route_id`) REFERENCES `routes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `tickets`;
CREATE TABLE `tickets` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `ticket_number` VARCHAR(40) NOT NULL UNIQUE,
    `reservation_id` BIGINT NOT NULL UNIQUE,
    `trip_id` BIGINT NOT NULL,
    `customer_id` BIGINT,
    `passenger_name` VARCHAR(120) NOT NULL,
    `seat_number` VARCHAR(10) NOT NULL,
    `fare_amount` DOUBLE NOT NULL,
    `issue_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `status` VARCHAR(30) NOT NULL DEFAULT 'ISSUED', -- ISSUED, USED, CANCELLED, REFUNDED
    `qr_code` VARCHAR(255),
    CONSTRAINT `fk_tkt_res` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_tkt_trip` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`),
    CONSTRAINT `fk_tkt_cust` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `transaction_ref` VARCHAR(50) NOT NULL UNIQUE,
    `reservation_id` BIGINT NOT NULL,
    `ticket_id` BIGINT,
    `amount` DOUBLE NOT NULL,
    `payment_method` VARCHAR(30) NOT NULL DEFAULT 'CREDIT_CARD', -- CREDIT_CARD, DEBIT_CARD, ONLINE_TRANSFER, CASH
    `payment_status` VARCHAR(30) NOT NULL DEFAULT 'COMPLETED',   -- COMPLETED, PENDING, FAILED, REFUNDED
    `payment_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `receipt_number` VARCHAR(40) NOT NULL UNIQUE,
    CONSTRAINT `fk_pay_res` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_pay_tkt` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `refunds`;
CREATE TABLE `refunds` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `refund_ref` VARCHAR(50) NOT NULL UNIQUE,
    `ticket_id` BIGINT NOT NULL,
    `reservation_id` BIGINT NOT NULL,
    `refund_amount` DOUBLE NOT NULL,
    `reason` VARCHAR(255) NOT NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'PROCESSED', -- PENDING, PROCESSED, REJECTED
    `processed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_ref_tkt` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`),
    CONSTRAINT `fk_ref_res` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`)
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 5. MEMBER 4: LOYALTY REWARDS MANAGEMENT (IT25103022)
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `reward_programs`;
CREATE TABLE `reward_programs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `program_name` VARCHAR(80) NOT NULL,
    `min_points` INT NOT NULL DEFAULT 100,
    `point_multiplier` DOUBLE NOT NULL DEFAULT 1.0,
    `discount_percentage` DOUBLE NOT NULL DEFAULT 5.0,
    `description` VARCHAR(255),
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `reward_accounts`;
CREATE TABLE `reward_accounts` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `customer_id` BIGINT NOT NULL UNIQUE,
    `current_points` INT NOT NULL DEFAULT 0,
    `total_earned` INT NOT NULL DEFAULT 0,
    `total_redeemed` INT NOT NULL DEFAULT 0,
    `tier_level` VARCHAR(30) NOT NULL DEFAULT 'BRONZE', -- BRONZE, SILVER, GOLD, PLATINUM
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_reward_cust` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `reward_transactions`;
CREATE TABLE `reward_transactions` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `account_id` BIGINT NOT NULL,
    `transaction_type` VARCHAR(30) NOT NULL, -- EARNED, REDEEMED, BONUS, EXPIRED
    `points` INT NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `transaction_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_rwd_acc` FOREIGN KEY (`account_id`) REFERENCES `reward_accounts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 6. MEMBER 5: CUSTOMER SERVICE MANAGEMENT (IT25102352)
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `complaints`;
CREATE TABLE `complaints` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `complaint_code` VARCHAR(40) NOT NULL UNIQUE,
    `customer_id` BIGINT,
    `category` VARCHAR(50) NOT NULL, -- BUS_CONDITION, DRIVER_CONDUCT, SCHEDULE_DELAY, FARE_ISSUE, LOST_PROPERTY
    `subject` VARCHAR(150) NOT NULL,
    `description` TEXT NOT NULL,
    `trip_reference` VARCHAR(40),
    `status` VARCHAR(30) NOT NULL DEFAULT 'OPEN', -- OPEN, IN_PROGRESS, RESOLVED, CLOSED
    `resolution_notes` TEXT,
    `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `resolved_at` TIMESTAMP NULL,
    CONSTRAINT `fk_comp_cust` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `support_requests`;
CREATE TABLE `support_requests` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `request_code` VARCHAR(40) NOT NULL UNIQUE,
    `customer_id` BIGINT,
    `subject` VARCHAR(150) NOT NULL,
    `priority` VARCHAR(20) NOT NULL DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, URGENT
    `description` TEXT NOT NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'OPEN',     -- OPEN, IN_PROGRESS, CLOSED
    `response` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_supp_cust` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `feedbacks`;
CREATE TABLE `feedbacks` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `customer_id` BIGINT,
    `trip_id` BIGINT,
    `rating` INT NOT NULL, -- 1 to 5
    `comments` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_fb_cust` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_fb_trip` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `recipient_id` BIGINT,
    `recipient_role` VARCHAR(40) DEFAULT 'CUSTOMER',
    `title` VARCHAR(150) NOT NULL,
    `message` TEXT NOT NULL,
    `is_read` BOOLEAN DEFAULT FALSE,
    `notification_type` VARCHAR(30) DEFAULT 'INFO', -- INFO, ALERT, DELAY, PROMOTION
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ----------------------------------------------------------
-- 7. MEMBER 6: EVENT TRANSPORT MANAGEMENT (IT25101077)
-- ----------------------------------------------------------
DROP TABLE IF EXISTS `transport_events`;
CREATE TABLE `transport_events` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `event_name` VARCHAR(120) NOT NULL,
    `event_type` VARCHAR(50) NOT NULL, -- CORPORATE, SPORTS, EXCURSION, PILGRIMAGE, WEDDING
    `organizer_name` VARCHAR(120) NOT NULL,
    `contact_phone` VARCHAR(20) NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `origin` VARCHAR(80) NOT NULL,
    `destination` VARCHAR(80) NOT NULL,
    `required_buses` INT NOT NULL DEFAULT 1,
    `required_capacity` INT NOT NULL DEFAULT 40,
    `status` VARCHAR(30) NOT NULL DEFAULT 'CONFIRMED', -- REQUESTED, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `event_trips`;
CREATE TABLE `event_trips` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `event_id` BIGINT NOT NULL,
    `bus_id` BIGINT NOT NULL,
    `driver_id` BIGINT NOT NULL,
    `trip_date` DATE NOT NULL,
    `departure_time` VARCHAR(10) NOT NULL,
    `return_time` VARCHAR(10),
    `status` VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED', -- SCHEDULED, ACTIVE, COMPLETED, CANCELLED
    CONSTRAINT `fk_evtrp_event` FOREIGN KEY (`event_id`) REFERENCES `transport_events` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_evtrp_bus` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`),
    CONSTRAINT `fk_evtrp_driver` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`)
) ENGINE=InnoDB;

DROP TABLE IF EXISTS `event_passengers`;
CREATE TABLE `event_passengers` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `event_id` BIGINT NOT NULL,
    `event_trip_id` BIGINT,
    `passenger_name` VARCHAR(120) NOT NULL,
    `contact_phone` VARCHAR(20) NOT NULL,
    `emergency_contact` VARCHAR(20),
    `seat_allocated` VARCHAR(10),
    `check_in_status` BOOLEAN DEFAULT FALSE,
    CONSTRAINT `fk_evpass_event` FOREIGN KEY (`event_id`) REFERENCES `transport_events` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_evpass_trip` FOREIGN KEY (`event_trip_id`) REFERENCES `event_trips` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;
