-- ==========================================================
-- Lanka Transit Services (Pvt) Ltd
-- Sample Seed Data for Demonstrations & Viva
-- ==========================================================

USE `lanka_transit_db`;

SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------
-- 1. USERS & CUSTOMERS
-- Passwords below are BCrypt hashes of each role's password:
-- Admin@123, Customer@123, Planner@123, Supervisor@123, Finance@123, Ops@123, Depot@123
-- ----------------------------------------------------------
INSERT INTO `users` (`id`, `username`, `email`, `password`, `full_name`, `phone`, `role`) VALUES
(1, 'admin', 'admin@lankatransit.lk', '$2a$10$w8T0M4lU2C6pE05NfXwQveX2wL6eOQ6tZ5hKjC7jRzFzB0yW.ZcIe', 'System Administrator', '+94 77 100 0001', 'SYSTEM_ADMIN'),
(2, 'planner', 'planner@lankatransit.lk', '$2a$10$w8T0M4lU2C6pE05NfXwQveX2wL6eOQ6tZ5hKjC7jRzFzB0yW.ZcIe', 'Hemantha Abeysinghe', '+94 77 200 0002', 'TRANSPORT_PLANNING_OFFICER'),
(3, 'supervisor', 'supervisor@lankatransit.lk', '$2a$10$w8T0M4lU2C6pE05NfXwQveX2wL6eOQ6tZ5hKjC7jRzFzB0yW.ZcIe', 'Gayashan Nimjaya', '+94 77 300 0003', 'CUSTOMER_SERVICE_SUPERVISOR'),
(4, 'finance', 'finance@lankatransit.lk', '$2a$10$w8T0M4lU2C6pE05NfXwQveX2wL6eOQ6tZ5hKjC7jRzFzB0yW.ZcIe', 'Kasun Perera', '+94 77 400 0004', 'FINANCE_ADMIN'),
(5, 'opsmanager', 'opsmanager@lankatransit.lk', '$2a$10$w8T0M4lU2C6pE05NfXwQveX2wL6eOQ6tZ5hKjC7jRzFzB0yW.ZcIe', 'Ilakkiya Sivakumaran', '+94 77 500 0005', 'OPERATIONS_MANAGER'),
(6, 'depot', 'depot@lankatransit.lk', '$2a$10$w8T0M4lU2C6pE05NfXwQveX2wL6eOQ6tZ5hKjC7jRzFzB0yW.ZcIe', 'Nimal Jayakody', '+94 77 600 0006', 'BUS_DEPOT_SUPERVISOR'),
(7, 'customer', 'customer@lankatransit.lk', '$2a$10$w8T0M4lU2C6pE05NfXwQveX2wL6eOQ6tZ5hKjC7jRzFzB0yW.ZcIe', 'Nuwan Berugoda', '+94 71 889 9123', 'CUSTOMER');

INSERT INTO `customers` (`id`, `user_id`, `nic`, `address`, `membership_tier`) VALUES
(1, 7, '200112345678', 'No. 45, Galle Road, Colombo 03', 'GOLD');

-- ----------------------------------------------------------
-- 2. BUSES & DRIVERS (MEMBER 1: IT25100270)
-- ----------------------------------------------------------
INSERT INTO `buses` (`id`, `bus_number`, `registration_number`, `capacity`, `bus_type`, `status`, `depot_location`, `air_conditioned`) VALUES
(1, 'BUS-001', 'ND-4521', 40, 'LUXURY_AC', 'ACTIVE', 'Colombo Fort Central Depot', 1),
(2, 'BUS-002', 'ND-7712', 40, 'HIGHWAY_EXPRESS', 'ACTIVE', 'Makumbura Multimodal Hub', 1),
(3, 'BUS-003', 'NB-8890', 44, 'SEMI_LUXURY', 'ACTIVE', 'Kandy Depot', 0),
(4, 'BUS-004', 'NA-3310', 40, 'LUXURY_AC', 'ACTIVE', 'Galle Bus Depot', 1),
(5, 'BUS-005', 'NC-9041', 40, 'STANDARD', 'MAINTENANCE', 'Kurunegala Depot', 0);

INSERT INTO `drivers` (`id`, `driver_code`, `full_name`, `license_number`, `phone`, `status`, `assigned_depot`) VALUES
(1, 'DRV-001', 'Sunil Wickramasinghe', 'B8849201', '+94 77 441 2301', 'AVAILABLE', 'Colombo Fort Central Depot'),
(2, 'DRV-002', 'Mahesh Priyantha', 'B3392102', '+94 76 552 3412', 'AVAILABLE', 'Makumbura Multimodal Hub'),
(3, 'DRV-003', 'Roshan Dissanayake', 'B9912043', '+94 71 663 4523', 'AVAILABLE', 'Kandy Depot'),
(4, 'DRV-004', 'Anura Kumara Silva', 'B1123954', '+94 78 774 5634', 'AVAILABLE', 'Galle Bus Depot'),
(5, 'DRV-005', 'Chaminda Bandara', 'B4477265', '+94 70 885 6745', 'ON_LEAVE', 'Colombo Fort Central Depot');

-- ----------------------------------------------------------
-- 3. ROUTES & STOPS (MEMBER 1: IT25100270)
-- ----------------------------------------------------------
INSERT INTO `routes` (`id`, `route_number`, `origin`, `destination`, `distance_km`, `estimated_duration_mins`, `base_fare`, `is_active`) VALUES
(1, 'EX-01', 'Colombo (Makumbura)', 'Galle', 118.0, 90, 850.0, 1),
(2, 'RT-01', 'Colombo (Fort)', 'Kandy', 115.0, 180, 650.0, 1),
(3, 'RT-05', 'Colombo (Fort)', 'Kurunegala', 94.0, 150, 550.0, 1),
(4, 'EX-02', 'Colombo (Makumbura)', 'Matara', 160.0, 120, 1100.0, 1),
(5, 'RT-15', 'Colombo (Fort)', 'Anuradhapura', 206.0, 270, 1250.0, 1);

INSERT INTO `route_stops` (`id`, `route_id`, `stop_name`, `stop_order`, `distance_from_origin_km`) VALUES
(1, 1, 'Makumbura Multimodal Hub', 1, 0.0),
(2, 1, 'Dodangoda Interchange', 2, 45.0),
(3, 1, 'Galle Central Bus Stand', 3, 118.0),
(4, 2, 'Colombo Fort Bus Stand', 1, 0.0),
(5, 2, 'Nittambuwa', 2, 40.0),
(6, 2, 'Kegalle', 3, 78.0),
(7, 2, 'Kandy Goods Shed', 4, 115.0);

-- ----------------------------------------------------------
-- 4. SCHEDULES (MEMBER 1: IT25100270)
-- ----------------------------------------------------------
INSERT INTO `schedules` (`id`, `schedule_code`, `route_id`, `bus_id`, `driver_id`, `departure_time`, `arrival_time`, `frequency`, `status`, `effective_from`, `effective_to`) VALUES
(1, 'SCH-EX01-MOR', 1, 2, 2, '07:00', '08:30', 'DAILY', 'ACTIVE', '2026-01-01', '2026-12-31'),
(2, 'SCH-EX01-EVE', 1, 2, 2, '16:30', '18:00', 'DAILY', 'ACTIVE', '2026-01-01', '2026-12-31'),
(3, 'SCH-RT01-MOR', 2, 1, 1, '06:30', '09:30', 'DAILY', 'ACTIVE', '2026-01-01', '2026-12-31'),
(4, 'SCH-RT01-AFT', 2, 1, 1, '14:00', '17:00', 'DAILY', 'ACTIVE', '2026-01-01', '2026-12-31'),
(5, 'SCH-RT05-MOR', 3, 3, 3, '08:00', '10:30', 'DAILY', 'ACTIVE', '2026-01-01', '2026-12-31');

-- ----------------------------------------------------------
-- 5. TRIPS & SEATS (MEMBER 2: IT25101542)
-- ----------------------------------------------------------
INSERT INTO `trips` (`id`, `trip_code`, `schedule_id`, `route_id`, `bus_id`, `driver_id`, `trip_date`, `departure_time`, `arrival_time`, `fare_amount`, `total_seats`, `available_seats`, `status`) VALUES
(1, 'TRP-20260915-01', 1, 1, 2, 2, '2026-09-15', '07:00', '08:30', 850.0, 40, 38, 'SCHEDULED'),
(2, 'TRP-20260915-02', 2, 1, 2, 2, '2026-09-15', '16:30', '18:00', 850.0, 40, 40, 'SCHEDULED'),
(3, 'TRP-20260915-03', 3, 2, 1, 1, '2026-09-15', '06:30', '09:30', 650.0, 40, 39, 'SCHEDULED'),
(4, 'TRP-20260916-01', 1, 1, 2, 2, '2026-09-16', '07:00', '08:30', 850.0, 40, 40, 'SCHEDULED');

-- Pre-fill initial seats for Trip 1
INSERT INTO `seats` (`trip_id`, `seat_number`, `seat_status`, `passenger_name`) VALUES
(1, '1A', 'BOOKED', 'Nuwan Berugoda'),
(1, '1B', 'BOOKED', 'Dilani Silva'),
(1, '2A', 'AVAILABLE', NULL),
(1, '2B', 'AVAILABLE', NULL),
(1, '3A', 'AVAILABLE', NULL),
(1, '3B', 'AVAILABLE', NULL);

-- ----------------------------------------------------------
-- 6. RESERVATIONS & TICKETS (MEMBER 2 & MEMBER 3)
-- ----------------------------------------------------------
INSERT INTO `reservations` (`id`, `booking_reference`, `trip_id`, `customer_id`, `passenger_name`, `passenger_phone`, `passenger_nic`, `seat_number`, `total_amount`, `reservation_status`, `created_at`) VALUES
(1, 'LT-RES-88901', 1, 1, 'Nuwan Berugoda', '+94 71 889 9123', '200112345678', '1A', 850.0, 'CONFIRMED', '2026-09-13 10:30:00');

INSERT INTO `tickets` (`id`, `ticket_number`, `reservation_id`, `trip_id`, `customer_id`, `passenger_name`, `seat_number`, `fare_amount`, `issue_date`, `status`, `qr_code`) VALUES
(1, 'TKT-2026-001', 1, 1, 1, 'Nuwan Berugoda', '1A', 850.0, '2026-09-13 10:32:00', 'ISSUED', 'QR_LT_RES_88901_1A');

INSERT INTO `payments` (`id`, `transaction_ref`, `reservation_id`, `ticket_id`, `amount`, `payment_method`, `payment_status`, `payment_date`, `receipt_number`) VALUES
(1, 'TXN-20260913-8891', 1, 1, 850.0, 'CREDIT_CARD', 'COMPLETED', '2026-09-13 10:31:00', 'RCPT-2026-001');

-- ----------------------------------------------------------
-- 7. FARE RULES (MEMBER 3: IT25103360)
-- ----------------------------------------------------------
INSERT INTO `fare_rules` (`id`, `rule_name`, `route_id`, `passenger_type`, `bus_type`, `base_price`, `per_km_rate`, `discount_percentage`, `is_active`) VALUES
(1, 'Standard Adult Highway Fare', 1, 'ADULT', 'HIGHWAY_EXPRESS', 300.0, 4.66, 0.0, 1),
(2, 'Child Expressway Fare (50% Off)', 1, 'CHILD', 'HIGHWAY_EXPRESS', 150.0, 2.33, 50.0, 1),
(3, 'Student Concession Kandy Route', 2, 'STUDENT', 'LUXURY_AC', 200.0, 3.50, 25.0, 1),
(4, 'Senior Citizen Welfare Fare', 2, 'SENIOR', 'LUXURY_AC', 200.0, 3.50, 30.0, 1);

-- ----------------------------------------------------------
-- 8. LOYALTY REWARDS (MEMBER 4: IT25103022)
-- ----------------------------------------------------------
INSERT INTO `reward_programs` (`id`, `program_name`, `min_points`, `point_multiplier`, `discount_percentage`, `description`, `is_active`) VALUES
(1, 'Bronze Explorer', 100, 1.0, 5.0, 'Entry level tier earning 1 point per Rs. 100 spent', 1),
(2, 'Silver Voyager', 500, 1.25, 10.0, 'Mid tier offering 10% discount vouchers and priority seat selection', 1),
(3, 'Gold Commuter', 1000, 1.5, 15.0, 'Premium commuter tier with 15% travel savings and express support', 1),
(4, 'Platinum Elite', 2500, 2.0, 25.0, 'Top tier VIP perks with complimentary seat upgrades and zero cancellation fees', 1);

INSERT INTO `reward_accounts` (`id`, `customer_id`, `current_points`, `total_earned`, `total_redeemed`, `tier_level`) VALUES
(1, 1, 650, 850, 200, 'SILVER');

INSERT INTO `reward_transactions` (`id`, `account_id`, `transaction_type`, `points`, `description`, `transaction_date`) VALUES
(1, 1, 'BONUS', 200, 'Welcome registration reward bonus', '2026-08-01 10:00:00'),
(2, 1, 'EARNED', 650, 'Trip points earned for Colombo to Galle express booking', '2026-09-13 10:32:00'),
(3, 1, 'REDEEMED', -200, 'Redeemed for Rs. 200 concession discount voucher', '2026-09-10 14:00:00');

-- ----------------------------------------------------------
-- 9. CUSTOMER SERVICE (MEMBER 5: IT25102352)
-- ----------------------------------------------------------
INSERT INTO `complaints` (`id`, `complaint_code`, `customer_id`, `category`, `subject`, `description`, `trip_reference`, `status`, `resolution_notes`, `submitted_at`, `resolved_at`) VALUES
(1, 'CMP-2026-001', 1, 'BUS_CONDITION', 'Air conditioning temperature too low', 'The AC was set excessively cold on the 07:00 Colombo-Galle highway bus without adjustment.', 'TRP-20260915-01', 'RESOLVED', 'Supervisor communicated with driver to maintain climate control at 24C.', '2026-09-10 12:00:00', '2026-09-11 15:30:00'),
(2, 'CMP-2026-002', 1, 'SCHEDULE_DELAY', '15 min departure delay at Fort', 'Departure was delayed due to luggage loading delay.', 'TRP-20260915-03', 'OPEN', NULL, '2026-09-13 14:15:00', NULL);

INSERT INTO `support_requests` (`id`, `request_code`, `customer_id`, `subject`, `priority`, `description`, `status`, `response`) VALUES
(1, 'SUP-2026-101', 1, 'Inquiry on luggage weight limit', 'LOW', 'What is the maximum allowed baggage weight for the highway luxury express bus?', 'CLOSED', 'Passengers can bring up to 2 luggage pieces with maximum 25kg total weight free of charge.');

INSERT INTO `feedbacks` (`id`, `customer_id`, `trip_id`, `rating`, `comments`) VALUES
(1, 1, 1, 5, 'Smooth, punctual journey along the Southern expressway. Very clean bus!');

INSERT INTO `notifications` (`id`, `recipient_id`, `recipient_role`, `title`, `message`, `is_read`, `notification_type`) VALUES
(1, 7, 'CUSTOMER', 'Booking Confirmed', 'Your booking LT-RES-88901 for seat 1A is confirmed. Safe travels!', 1, 'INFO'),
(2, 7, 'CUSTOMER', 'Special Promo', 'Earn 2x Loyalty Points on all Southern Expressway trips this weekend!', 0, 'PROMOTION');

-- ----------------------------------------------------------
-- 10. EVENT TRANSPORT (MEMBER 6: IT25101077)
-- ----------------------------------------------------------
INSERT INTO `transport_events` (`id`, `event_name`, `event_type`, `organizer_name`, `contact_phone`, `start_date`, `end_date`, `origin`, `destination`, `required_buses`, `required_capacity`, `status`) VALUES
(1, 'SLIIT National Tech Symposium 2026', 'EXCURSION', 'Faculty of Computing', '+94 77 912 3456', '2026-10-05', '2026-10-06', 'SLIIT Malabe Campus', 'BMICH Colombo', 2, 80, 'CONFIRMED'),
(2, 'Southern Corporate Leadership Summit', 'CORPORATE', 'Apex Lanka Holdings', '+94 71 334 5566', '2026-10-12', '2026-10-12', 'Colombo Fort', 'Jetwing Lighthouse Galle', 1, 40, 'CONFIRMED');

INSERT INTO `event_trips` (`id`, `event_id`, `bus_id`, `driver_id`, `trip_date`, `departure_time`, `return_time`, `status`) VALUES
(1, 1, 1, 1, '2026-10-05', '07:30', '18:00', 'SCHEDULED'),
(2, 1, 4, 4, '2026-10-05', '07:30', '18:00', 'SCHEDULED');

INSERT INTO `event_passengers` (`id`, `event_id`, `event_trip_id`, `passenger_name`, `contact_phone`, `emergency_contact`, `seat_allocated`, `check_in_status`) VALUES
(1, 1, 1, 'Dr. Nuwan Kodagoda', '+94 77 111 2233', '+94 77 999 8877', '1A', 1),
(2, 1, 1, 'Prof. Koliya Pulasinghe', '+94 77 222 3344', '+94 77 888 7766', '1B', 0);

SET FOREIGN_KEY_CHECKS = 1;
