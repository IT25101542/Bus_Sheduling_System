-- MySQL dump 10.13  Distrib 8.4.7, for Win64 (x86_64)
--
-- Host: localhost    Database: lanka_transit_db
-- ------------------------------------------------------
-- Server version	8.4.7

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `lanka_transit_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `lanka_transit_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `lanka_transit_db`;

--
-- Table structure for table `buses`
--

DROP TABLE IF EXISTS `buses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `air_conditioned` bit(1) DEFAULT NULL,
  `bus_number` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bus_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `capacity` int NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `depot_location` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `registration_number` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_f0wpejbtx1fk17hi1t6ba5vbv` (`bus_number`),
  UNIQUE KEY `UK_eqck0ex424pjnawvgifj2k5fm` (`registration_number`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buses`
--

LOCK TABLES `buses` WRITE;
/*!40000 ALTER TABLE `buses` DISABLE KEYS */;
INSERT INTO `buses` VALUES (1,_binary '','BUS-001','LUXURY_AC',40,'2026-09-13 18:27:29.817195','Colombo Fort Central Depot','ND-4521','ACTIVE'),(2,_binary '','BUS-002','HIGHWAY_EXPRESS',40,'2026-09-13 18:27:29.822447','Makumbura Multimodal Hub','ND-7712','ACTIVE'),(3,_binary '\0','BUS-003','SEMI_LUXURY',44,'2026-09-13 18:27:29.827083','Kandy Depot','NB-8890','ACTIVE'),(4,_binary '','BUS-004','LUXURY_AC',40,'2026-09-13 18:27:29.830592','Galle Bus Depot','NA-3310','ACTIVE'),(5,_binary '','BUS-005','LUXURY_AC',40,'2026-09-13 18:27:29.836485','Nuwara Eliya Depot','NC-9041','ACTIVE'),(6,_binary '','BUS-006','SUPER_LUXURY',36,'2026-09-13 18:27:29.839735','Jaffna Central Terminal','WP-GA-1122','ACTIVE'),(7,_binary '','BUS-007','LUXURY_AC',40,'2026-09-13 18:27:29.844073','Anuradhapura Depot','NC-6677','ACTIVE'),(8,_binary '','BUS-008','LUXURY_AC',40,'2026-09-13 18:27:29.849930','Trincomalee Depot','EP-4433','ACTIVE'),(9,_binary '\0','BUS-009','SEMI_LUXURY',44,'2026-09-13 18:27:29.855976','Badulla / Ella Depot','UP-5511','ACTIVE'),(10,_binary '','BUS-010','HIGHWAY_EXPRESS',35,'2026-09-13 18:27:29.861792','Katunayake Airport Hub','WP-ND-9901','ACTIVE');
/*!40000 ALTER TABLE `buses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `complaints`
--

DROP TABLE IF EXISTS `complaints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `complaints` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `complaint_code` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `resolution_notes` text COLLATE utf8mb4_unicode_ci,
  `resolved_at` datetime(6) DEFAULT NULL,
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `submitted_at` datetime(6) DEFAULT NULL,
  `trip_reference` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_3nxmko0tdym843wmb05vw6g80` (`complaint_code`),
  KEY `FKmua2lxim39d851mt78cu4vbtk` (`customer_id`),
  CONSTRAINT `FKmua2lxim39d851mt78cu4vbtk` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `complaints`
--

LOCK TABLES `complaints` WRITE;
/*!40000 ALTER TABLE `complaints` DISABLE KEYS */;
INSERT INTO `complaints` VALUES (1,'BUS_CONDITION','CMP-2026-001','The AC was set excessively cold on the 07:00 Colombo-Galle bus without adjustment.',NULL,NULL,'OPEN','Air conditioning temperature too low','2026-09-13 18:27:30.884941','TRP-20260913-01',1),(2,'SCHEDULE_DELAY','CMP-2026-002','Departure was delayed due to luggage loading delay.','Depot supervisor instructed loaders to adhere strictly to 5 min boarding cutoff.','2026-09-12 18:27:30.890164','RESOLVED','15 min departure delay at Fort','2026-09-13 18:27:30.890164','TRP-20260913-05',1);
/*!40000 ALTER TABLE `complaints` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `membership_tier` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nic` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_euat1oase6eqv195jvb71a93s` (`user_id`),
  CONSTRAINT `FKrh1g1a20omjmn6kurd35o3eit` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'No. 45, Galle Road, Colombo 03','2026-09-13 18:27:29.810684','GOLD','200112345678',7),(2,'','2026-09-13 18:45:39.427489','BRONZE','',8);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delay_logs`
--

DROP TABLE IF EXISTS `delay_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delay_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `delay_minutes` int NOT NULL,
  `delay_reason` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reported_at` datetime(6) DEFAULT NULL,
  `reported_by` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_departure_time` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `schedule_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKtkysj10xmsanfb4shgly5ypii` (`schedule_id`),
  CONSTRAINT `FKtkysj10xmsanfb4shgly5ypii` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delay_logs`
--

LOCK TABLES `delay_logs` WRITE;
/*!40000 ALTER TABLE `delay_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `delay_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drivers`
--

DROP TABLE IF EXISTS `drivers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `drivers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `assigned_depot` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `driver_code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `license_number` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_aci756ta5yabak10263t72gny` (`driver_code`),
  UNIQUE KEY `UK_cr60ij36fuvtcb87298g6rct6` (`license_number`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drivers`
--

LOCK TABLES `drivers` WRITE;
/*!40000 ALTER TABLE `drivers` DISABLE KEYS */;
INSERT INTO `drivers` VALUES (1,'Colombo Fort Central Depot','2026-09-13 18:27:29.866280','DRV-001','Sunil Wickramasinghe','B8849201','+94 77 441 2301','AVAILABLE'),(2,'Makumbura Multimodal Hub','2026-09-13 18:27:29.871089','DRV-002','Mahesh Priyantha','B3392102','+94 76 552 3412','AVAILABLE'),(3,'Kandy Depot','2026-09-13 18:27:29.876598','DRV-003','Roshan Dissanayake','B9912043','+94 71 663 4523','AVAILABLE'),(4,'Galle Bus Depot','2026-09-13 18:27:29.879748','DRV-004','Anura Kumara Silva','B1123954','+94 78 774 5634','AVAILABLE'),(5,'Colombo Fort Central Depot','2026-09-13 18:27:29.885396','DRV-005','Chaminda Bandara','B4477265','+94 70 885 6745','AVAILABLE'),(6,'Jaffna Central Terminal','2026-09-13 18:27:29.890300','DRV-006','K. Ratnam','B5521980','+94 77 912 3456','AVAILABLE'),(7,'Anuradhapura Depot','2026-09-13 18:27:29.893957','DRV-007','P. Herath','B6612091','+94 71 823 4567','AVAILABLE'),(8,'Trincomalee Depot','2026-09-13 18:27:29.899896','DRV-008','S. Mohamed','B7734102','+94 76 734 5678','AVAILABLE'),(9,'Badulla / Ella Depot','2026-09-13 18:27:29.903672','DRV-009','N. Jayawardena','B8845213','+94 75 645 6789','AVAILABLE'),(10,'Katunayake Airport Hub','2026-09-13 18:27:29.906995','DRV-010','K. Fernando','B9956324','+94 78 556 7890','AVAILABLE');
/*!40000 ALTER TABLE `drivers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_passengers`
--

DROP TABLE IF EXISTS `event_passengers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_passengers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `check_in_status` bit(1) DEFAULT NULL,
  `contact_phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `emergency_contact` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `passenger_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `seat_allocated` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `event_id` bigint NOT NULL,
  `event_trip_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK71hqrx2odft1i8lyod45qelbg` (`event_id`),
  KEY `FKm42fkrrdafvl1bit5mau4i7lg` (`event_trip_id`),
  CONSTRAINT `FK71hqrx2odft1i8lyod45qelbg` FOREIGN KEY (`event_id`) REFERENCES `transport_events` (`id`),
  CONSTRAINT `FKm42fkrrdafvl1bit5mau4i7lg` FOREIGN KEY (`event_trip_id`) REFERENCES `event_trips` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_passengers`
--

LOCK TABLES `event_passengers` WRITE;
/*!40000 ALTER TABLE `event_passengers` DISABLE KEYS */;
INSERT INTO `event_passengers` VALUES (1,_binary '\0','+94 77 111 2233','+94 77 999 8877','Dr. Nuwan Kodagoda','1A',1,1),(2,_binary '\0','+94 77 222 3344','+94 77 888 7766','Prof. Koliya Pulasinghe','1B',1,1);
/*!40000 ALTER TABLE `event_passengers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_trips`
--

DROP TABLE IF EXISTS `event_trips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_trips` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `departure_time` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `return_time` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `trip_date` date NOT NULL,
  `bus_id` bigint NOT NULL,
  `driver_id` bigint NOT NULL,
  `event_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKjx0bvw1oaens6tw5wtcggtgs2` (`bus_id`),
  KEY `FKpwli61yaxvtbm9ngwtexk79cu` (`driver_id`),
  KEY `FK91yrlbdklitl9k2clsbnpb0h0` (`event_id`),
  CONSTRAINT `FK91yrlbdklitl9k2clsbnpb0h0` FOREIGN KEY (`event_id`) REFERENCES `transport_events` (`id`),
  CONSTRAINT `FKjx0bvw1oaens6tw5wtcggtgs2` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`),
  CONSTRAINT `FKpwli61yaxvtbm9ngwtexk79cu` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_trips`
--

LOCK TABLES `event_trips` WRITE;
/*!40000 ALTER TABLE `event_trips` DISABLE KEYS */;
INSERT INTO `event_trips` VALUES (1,'07:30','18:00','SCHEDULED','2026-09-23',1,1,1);
/*!40000 ALTER TABLE `event_trips` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fare_rules`
--

DROP TABLE IF EXISTS `fare_rules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fare_rules` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `is_active` bit(1) DEFAULT NULL,
  `base_price` double NOT NULL,
  `bus_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_percentage` double DEFAULT NULL,
  `passenger_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `per_km_rate` double NOT NULL,
  `rule_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `route_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKm52rb0413cpdjsd1gwj2mgsg8` (`route_id`),
  CONSTRAINT `FKm52rb0413cpdjsd1gwj2mgsg8` FOREIGN KEY (`route_id`) REFERENCES `routes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fare_rules`
--

LOCK TABLES `fare_rules` WRITE;
/*!40000 ALTER TABLE `fare_rules` DISABLE KEYS */;
INSERT INTO `fare_rules` VALUES (1,_binary '',300,'HIGHWAY_EXPRESS',0,'ADULT',4.66,'Standard Adult Highway Fare',1),(2,_binary '',150,'HIGHWAY_EXPRESS',50,'CHILD',2.33,'Child Expressway Fare (50% Off)',1),(3,_binary '',200,'LUXURY_AC',25,'STUDENT',3.5,'Student Concession Kandy Route',3),(4,_binary '',200,'LUXURY_AC',30,'SENIOR',3.5,'Senior Citizen Welfare Fare',3);
/*!40000 ALTER TABLE `fare_rules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedbacks`
--

DROP TABLE IF EXISTS `feedbacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedbacks` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `comments` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(6) DEFAULT NULL,
  `rating` int NOT NULL,
  `customer_id` bigint DEFAULT NULL,
  `trip_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKi9b9keigxngo4a35fgwt4h2v6` (`customer_id`),
  KEY `FKbmdpwv7a4h1l8x7l8lmti2bww` (`trip_id`),
  CONSTRAINT `FKbmdpwv7a4h1l8x7l8lmti2bww` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`),
  CONSTRAINT `FKi9b9keigxngo4a35fgwt4h2v6` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedbacks`
--

LOCK TABLES `feedbacks` WRITE;
/*!40000 ALTER TABLE `feedbacks` DISABLE KEYS */;
INSERT INTO `feedbacks` VALUES (1,'Smooth, punctual journey along the Southern expressway. Very clean bus!','2026-09-13 18:27:30.900657',5,1,1);
/*!40000 ALTER TABLE `feedbacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `notification_type` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_read` bit(1) DEFAULT NULL,
  `recipient_id` bigint DEFAULT NULL,
  `recipient_role` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,'2026-09-13 18:27:30.906456','Your booking LT-RES-88901 for seat 1A is confirmed. Safe travels!','INFO',_binary '\0',7,'CUSTOMER','Booking Confirmed'),(2,'2026-09-13 18:27:30.911498','Earn 2x Loyalty Points on all Southern Expressway trips this weekend!','PROMOTION',_binary '\0',7,'CUSTOMER','Special Promo');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` double NOT NULL,
  `payment_date` datetime(6) DEFAULT NULL,
  `payment_method` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `receipt_number` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `transaction_ref` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reservation_id` bigint NOT NULL,
  `ticket_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_u6rnuxne864s4rh7qgeql1vx` (`receipt_number`),
  UNIQUE KEY `UK_jwk4x78utnlycetjq9ulvm7tr` (`transaction_ref`),
  KEY `FKp8yh4sjt3u0g6aru1oxfh3o14` (`reservation_id`),
  KEY `FKix2erkxpmt7dx3e8dhjnunm52` (`ticket_id`),
  CONSTRAINT `FKix2erkxpmt7dx3e8dhjnunm52` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`),
  CONSTRAINT `FKp8yh4sjt3u0g6aru1oxfh3o14` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,850,'2026-09-13 18:27:30.829836','CREDIT_CARD','COMPLETED','RCPT-2026-001','TXN-20260913-8891',1,1);
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refunds`
--

DROP TABLE IF EXISTS `refunds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refunds` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `processed_at` datetime(6) DEFAULT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `refund_amount` double NOT NULL,
  `refund_ref` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reservation_id` bigint NOT NULL,
  `ticket_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_boq952gpymrwk1qjxvkc4u2ho` (`refund_ref`),
  KEY `FKooen28cv2rupu82lwbhjh77ym` (`reservation_id`),
  KEY `FKlcljjuvuakfkpg7i4knsj6se8` (`ticket_id`),
  CONSTRAINT `FKlcljjuvuakfkpg7i4knsj6se8` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`),
  CONSTRAINT `FKooen28cv2rupu82lwbhjh77ym` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refunds`
--

LOCK TABLES `refunds` WRITE;
/*!40000 ALTER TABLE `refunds` DISABLE KEYS */;
/*!40000 ALTER TABLE `refunds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `booking_reference` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `passenger_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passenger_nic` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `passenger_phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reservation_status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `seat_number` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_amount` double NOT NULL,
  `customer_id` bigint DEFAULT NULL,
  `trip_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_jgdj5d5i7cid1nd2i9ibb62ov` (`booking_reference`),
  KEY `FK8eccffekcj27jkdiyw2e9r8ks` (`customer_id`),
  KEY `FKhr010jlx5l5a7y9x9s51lw7m2` (`trip_id`),
  CONSTRAINT `FK8eccffekcj27jkdiyw2e9r8ks` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `FKhr010jlx5l5a7y9x9s51lw7m2` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` VALUES (1,'LT-RES-88901','2026-09-13 18:27:30.819000','Nuwan Berugoda','200112345678','+94 71 889 9123','CONFIRMED','1A',850,1,1);
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reward_accounts`
--

DROP TABLE IF EXISTS `reward_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reward_accounts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `current_points` int NOT NULL,
  `tier_level` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_earned` int NOT NULL,
  `total_redeemed` int NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `customer_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_1hh20nw6ve2bc6x2ny1vv7oa3` (`customer_id`),
  CONSTRAINT `FKjxqaxao73x7wwbif73n6b4fyk` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reward_accounts`
--

LOCK TABLES `reward_accounts` WRITE;
/*!40000 ALTER TABLE `reward_accounts` DISABLE KEYS */;
INSERT INTO `reward_accounts` VALUES (1,650,'SILVER',850,200,'2026-09-13 18:27:30.870183',1),(2,0,'BRONZE',0,0,'2026-09-14 13:19:44.112826',2);
/*!40000 ALTER TABLE `reward_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reward_programs`
--

DROP TABLE IF EXISTS `reward_programs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reward_programs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `is_active` bit(1) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discount_percentage` double NOT NULL,
  `min_points` int NOT NULL,
  `point_multiplier` double NOT NULL,
  `program_name` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reward_programs`
--

LOCK TABLES `reward_programs` WRITE;
/*!40000 ALTER TABLE `reward_programs` DISABLE KEYS */;
INSERT INTO `reward_programs` VALUES (1,_binary '','2026-09-13 18:27:30.851421','Entry level tier earning 1 point per Rs. 100 spent',5,100,1,'Bronze Explorer'),(2,_binary '','2026-09-13 18:27:30.857088','Mid tier offering 10% discount vouchers and priority seat selection',10,500,1.25,'Silver Voyager'),(3,_binary '','2026-09-13 18:27:30.860898','Premium commuter tier with 15% travel savings and express support',15,1000,1.5,'Gold Commuter'),(4,_binary '','2026-09-13 18:27:30.866032','Top tier VIP perks with complimentary seat upgrades and zero cancellation fees',25,2500,2,'Platinum Elite');
/*!40000 ALTER TABLE `reward_programs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reward_transactions`
--

DROP TABLE IF EXISTS `reward_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reward_transactions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `points` int NOT NULL,
  `transaction_date` datetime(6) DEFAULT NULL,
  `transaction_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKnp5appqt63yj8ef0x7j4eq5p9` (`account_id`),
  CONSTRAINT `FKnp5appqt63yj8ef0x7j4eq5p9` FOREIGN KEY (`account_id`) REFERENCES `reward_accounts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reward_transactions`
--

LOCK TABLES `reward_transactions` WRITE;
/*!40000 ALTER TABLE `reward_transactions` DISABLE KEYS */;
INSERT INTO `reward_transactions` VALUES (1,'Welcome registration reward bonus',200,'2026-09-13 18:27:30.876696','BONUS',1),(2,'Trip points earned for Colombo to Galle express booking',650,'2026-09-13 18:27:30.880724','EARNED',1);
/*!40000 ALTER TABLE `reward_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `route_stops`
--

DROP TABLE IF EXISTS `route_stops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `route_stops` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `distance_from_origin_km` double NOT NULL,
  `stop_name` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stop_order` int NOT NULL,
  `route_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK63y33daxb1qs5nbnkuicbpkej` (`route_id`),
  CONSTRAINT `FK63y33daxb1qs5nbnkuicbpkej` FOREIGN KEY (`route_id`) REFERENCES `routes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `route_stops`
--

LOCK TABLES `route_stops` WRITE;
/*!40000 ALTER TABLE `route_stops` DISABLE KEYS */;
INSERT INTO `route_stops` VALUES (1,0,'Makumbura Multimodal Hub',1,1),(2,45,'Dodangoda Interchange',2,1),(3,118,'Galle Central Bus Stand',3,1),(4,0,'Galle Central Bus Stand',1,2),(5,73,'Dodangoda Interchange',2,2),(6,118,'Makumbura Multimodal Hub',3,2),(7,0,'Colombo Fort Bus Stand',1,3),(8,40,'Nittambuwa',2,3),(9,78,'Kegalle',3,3),(10,115,'Kandy Goods Shed',4,3),(11,0,'Kandy Goods Shed',1,4),(12,37,'Kegalle',2,4),(13,75,'Nittambuwa',3,4),(14,115,'Colombo Fort Bus Stand',4,4);
/*!40000 ALTER TABLE `route_stops` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `routes`
--

DROP TABLE IF EXISTS `routes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `routes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `is_active` bit(1) DEFAULT NULL,
  `base_fare` double NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `destination` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `distance_km` double NOT NULL,
  `estimated_duration_mins` int NOT NULL,
  `origin` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `route_number` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_1yyhs6ni5jd9tam8wp5vsqnsc` (`route_number`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routes`
--

LOCK TABLES `routes` WRITE;
/*!40000 ALTER TABLE `routes` DISABLE KEYS */;
INSERT INTO `routes` VALUES (1,_binary '',850,'2026-09-13 18:27:29.911901','Galle',118,90,'Colombo (Makumbura)','EX-01'),(2,_binary '',850,'2026-09-13 18:27:29.932671','Colombo (Makumbura)',118,90,'Galle','EX-01R'),(3,_binary '',650,'2026-09-13 18:27:29.938236','Kandy',115,180,'Colombo (Fort)','RT-01'),(4,_binary '',650,'2026-09-13 18:27:29.942454','Colombo (Fort)',115,180,'Kandy','RT-01R'),(5,_binary '',550,'2026-09-13 18:27:29.948914','Kurunegala',94,150,'Colombo (Fort)','RT-05'),(6,_binary '',550,'2026-09-13 18:27:29.954921','Colombo (Fort)',94,150,'Kurunegala','RT-05R'),(7,_binary '',1100,'2026-09-13 18:27:29.960744','Matara',160,120,'Colombo (Makumbura)','EX-02'),(8,_binary '',1100,'2026-09-13 18:27:29.965216','Colombo (Makumbura)',160,120,'Matara','EX-02R'),(9,_binary '',2400,'2026-09-13 18:27:29.970882','Jaffna',395,450,'Colombo (Fort)','RT-87'),(10,_binary '',2400,'2026-09-13 18:27:29.975928','Colombo (Fort)',395,450,'Jaffna','RT-87R'),(11,_binary '',950,'2026-09-13 18:27:29.982214','Anuradhapura',205,270,'Colombo (Fort)','RT-57'),(12,_binary '',950,'2026-09-13 18:27:29.989360','Colombo (Fort)',205,270,'Anuradhapura','RT-57R'),(13,_binary '',1250,'2026-09-13 18:27:29.999395','Badulla',230,360,'Colombo (Fort)','RT-99'),(14,_binary '',1250,'2026-09-13 18:27:30.008452','Colombo (Fort)',230,360,'Badulla','RT-99R'),(15,_binary '',1600,'2026-09-13 18:27:30.017021','Trincomalee',260,330,'Colombo (Fort)','RT-49'),(16,_binary '',1600,'2026-09-13 18:27:30.020778','Colombo (Fort)',260,330,'Trincomalee','RT-49R'),(17,_binary '',450,'2026-09-13 18:27:30.027275','Negombo',35,45,'Colombo (Fort)','EX-03'),(18,_binary '',450,'2026-09-13 18:27:30.034903','Colombo (Fort)',35,45,'Negombo','EX-03R'),(19,_binary '',1100,'2026-09-13 18:27:30.041522','Nuwara Eliya',165,300,'Colombo (Fort)','RT-79'),(20,_binary '',1100,'2026-09-13 18:27:30.047346','Colombo (Fort)',165,300,'Nuwara Eliya','RT-79R'),(21,_binary '',1450,'2026-09-13 18:27:30.053874','Hambantota',220,165,'Colombo (Makumbura)','EX-04'),(22,_binary '',1450,'2026-09-13 18:27:30.058385','Colombo (Makumbura)',220,165,'Hambantota','EX-04R');
/*!40000 ALTER TABLE `routes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedules`
--

DROP TABLE IF EXISTS `schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedules` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `arrival_time` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `departure_time` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `effective_from` date DEFAULT NULL,
  `effective_to` date DEFAULT NULL,
  `frequency` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `schedule_code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bus_id` bigint NOT NULL,
  `driver_id` bigint NOT NULL,
  `route_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_gc0d0jm9xlu9ehlb4lnal0hyg` (`schedule_code`),
  KEY `FKpuih24muu99o0lkfkasqh26uj` (`bus_id`),
  KEY `FKa5jukepsmojoquw2176pe5ut2` (`driver_id`),
  KEY `FKc29vj8art9umx13trmnv0pqw7` (`route_id`),
  CONSTRAINT `FKa5jukepsmojoquw2176pe5ut2` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`),
  CONSTRAINT `FKc29vj8art9umx13trmnv0pqw7` FOREIGN KEY (`route_id`) REFERENCES `routes` (`id`),
  CONSTRAINT `FKpuih24muu99o0lkfkasqh26uj` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedules`
--

LOCK TABLES `schedules` WRITE;
/*!40000 ALTER TABLE `schedules` DISABLE KEYS */;
INSERT INTO `schedules` VALUES (1,'08:30','2026-09-13 18:27:30.196235','07:00','2026-08-13','2027-03-13','DAILY','SCH-EX01-0700','ACTIVE',2,2,1),(2,'18:00','2026-09-13 18:27:30.201706','16:30','2026-08-13','2027-03-13','DAILY','SCH-EX01-1630','ACTIVE',2,2,1),(3,'11:30','2026-09-13 18:27:30.206279','10:00','2026-08-13','2027-03-13','DAILY','SCH-EX01R-1000','ACTIVE',2,2,2),(4,'20:30','2026-09-13 18:27:30.209704','19:00','2026-08-13','2027-03-13','DAILY','SCH-EX01R-1900','ACTIVE',2,2,2),(5,'09:30','2026-09-13 18:27:30.214218','06:30','2026-08-13','2027-03-13','DAILY','SCH-RT01-0630','ACTIVE',1,1,3),(6,'17:00','2026-09-13 18:27:30.218727','14:00','2026-08-13','2027-03-13','DAILY','SCH-RT01-1400','ACTIVE',1,1,3),(7,'14:00','2026-09-13 18:27:30.222536','11:00','2026-08-13','2027-03-13','DAILY','SCH-RT01R-1100','ACTIVE',1,1,4),(8,'21:00','2026-09-13 18:27:30.227272','18:00','2026-08-13','2027-03-13','DAILY','SCH-RT01R-1800','ACTIVE',1,1,4),(9,'10:30','2026-09-13 18:27:30.231793','08:00','2026-08-13','2027-03-13','DAILY','SCH-RT05-0800','ACTIVE',3,3,5),(10,'15:30','2026-09-13 18:27:30.238329','13:00','2026-08-13','2027-03-13','DAILY','SCH-RT05R-1300','ACTIVE',3,3,6),(11,'11:00','2026-09-13 18:27:30.240497','09:00','2026-08-13','2027-03-13','DAILY','SCH-EX02-0900','ACTIVE',4,4,7),(12,'16:30','2026-09-13 18:27:30.246014','14:30','2026-08-13','2027-03-13','DAILY','SCH-EX02R-1430','ACTIVE',4,4,8),(13,'05:00','2026-09-13 18:27:30.250731','21:00','2026-08-13','2027-03-13','DAILY','SCH-RT87-2100','ACTIVE',6,6,9),(14,'05:30','2026-09-13 18:27:30.254758','21:30','2026-08-13','2027-03-13','DAILY','SCH-RT87R-2130','ACTIVE',6,6,10),(15,'12:00','2026-09-13 18:27:30.258421','07:30','2026-08-13','2027-03-13','DAILY','SCH-RT57-0730','ACTIVE',7,7,11),(16,'18:30','2026-09-13 18:27:30.262606','14:00','2026-08-13','2027-03-13','DAILY','SCH-RT57R-1400','ACTIVE',7,7,12),(17,'12:00','2026-09-13 18:27:30.268306','06:00','2026-08-13','2027-03-13','DAILY','SCH-RT99-0600','ACTIVE',9,9,13),(18,'19:00','2026-09-13 18:27:30.272310','13:00','2026-08-13','2027-03-13','DAILY','SCH-RT99R-1300','ACTIVE',9,9,14),(19,'12:00','2026-09-13 18:27:30.278374','06:30','2026-08-13','2027-03-13','DAILY','SCH-RT49-0630','ACTIVE',8,8,15),(20,'20:00','2026-09-13 18:27:30.282680','14:30','2026-08-13','2027-03-13','DAILY','SCH-RT49R-1430','ACTIVE',8,8,16),(21,'08:45','2026-09-13 18:27:30.288532','08:00','2026-08-13','2027-03-13','DAILY','SCH-EX03-0800','ACTIVE',10,10,17),(22,'11:45','2026-09-13 18:27:30.291536','11:00','2026-08-13','2027-03-13','DAILY','SCH-EX03R-1100','ACTIVE',10,10,18),(23,'11:30','2026-09-13 18:27:30.295093','06:30','2026-08-13','2027-03-13','DAILY','SCH-RT79-0630','ACTIVE',5,5,19),(24,'18:30','2026-09-13 18:27:30.300811','13:30','2026-08-13','2027-03-13','DAILY','SCH-RT79R-1330','ACTIVE',5,5,20),(25,'11:15','2026-09-13 18:27:30.303847','08:30','2026-08-13','2027-03-13','DAILY','SCH-EX04-0830','ACTIVE',4,4,21),(26,'17:45','2026-09-13 18:27:30.310360','15:00','2026-08-13','2027-03-13','DAILY','SCH-EX04R-1500','ACTIVE',4,4,22);
/*!40000 ALTER TABLE `schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seats`
--

DROP TABLE IF EXISTS `seats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seats` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `passenger_gender` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `passenger_name` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seat_number` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `seat_status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `trip_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKhsvatkoxuuyjphwdsbde0rn02` (`trip_id`,`seat_number`),
  CONSTRAINT `FK4vm7xuvuh00qp354d1vywnqu2` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seats`
--

LOCK TABLES `seats` WRITE;
/*!40000 ALTER TABLE `seats` DISABLE KEYS */;
INSERT INTO `seats` VALUES (1,NULL,NULL,'1A','BOOKED',1),(2,NULL,NULL,'1B','BOOKED',1),(3,NULL,NULL,'1C','AVAILABLE',1),(4,NULL,NULL,'1D','AVAILABLE',1),(5,NULL,NULL,'2A','AVAILABLE',1),(6,NULL,NULL,'2B','AVAILABLE',1),(7,NULL,NULL,'2C','AVAILABLE',1),(8,NULL,NULL,'2D','AVAILABLE',1),(9,NULL,NULL,'3A','AVAILABLE',1),(10,NULL,NULL,'3B','AVAILABLE',1),(11,NULL,NULL,'3C','AVAILABLE',1),(12,NULL,NULL,'3D','AVAILABLE',1),(13,NULL,NULL,'4A','AVAILABLE',1),(14,NULL,NULL,'4B','AVAILABLE',1),(15,NULL,NULL,'4C','AVAILABLE',1),(16,NULL,NULL,'4D','AVAILABLE',1),(17,NULL,NULL,'5A','AVAILABLE',1),(18,NULL,NULL,'5B','AVAILABLE',1),(19,NULL,NULL,'5C','AVAILABLE',1),(20,NULL,NULL,'5D','AVAILABLE',1),(21,NULL,NULL,'6A','AVAILABLE',1),(22,NULL,NULL,'6B','AVAILABLE',1),(23,NULL,NULL,'6C','AVAILABLE',1),(24,NULL,NULL,'6D','AVAILABLE',1),(25,NULL,NULL,'7A','AVAILABLE',1),(26,NULL,NULL,'7B','AVAILABLE',1),(27,NULL,NULL,'7C','AVAILABLE',1),(28,NULL,NULL,'7D','AVAILABLE',1),(29,NULL,NULL,'8A','AVAILABLE',1),(30,NULL,NULL,'8B','AVAILABLE',1),(31,NULL,NULL,'8C','AVAILABLE',1),(32,NULL,NULL,'8D','AVAILABLE',1),(33,NULL,NULL,'9A','AVAILABLE',1),(34,NULL,NULL,'9B','AVAILABLE',1),(35,NULL,NULL,'9C','AVAILABLE',1),(36,NULL,NULL,'9D','AVAILABLE',1),(37,NULL,NULL,'10A','AVAILABLE',1),(38,NULL,NULL,'10B','AVAILABLE',1),(39,NULL,NULL,'10C','AVAILABLE',1),(40,NULL,NULL,'10D','AVAILABLE',1);
/*!40000 ALTER TABLE `seats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `support_requests`
--

DROP TABLE IF EXISTS `support_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `support_requests` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `priority` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `request_code` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `response` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_2dv52vb6gfyl3iwwgeck6qxy7` (`request_code`),
  KEY `FKfasg54931u3i991kiv0jq7ul5` (`customer_id`),
  CONSTRAINT `FKfasg54931u3i991kiv0jq7ul5` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `support_requests`
--

LOCK TABLES `support_requests` WRITE;
/*!40000 ALTER TABLE `support_requests` DISABLE KEYS */;
INSERT INTO `support_requests` VALUES (1,'2026-09-13 18:27:30.893671','What is the maximum allowed baggage weight for the highway luxury express bus?','LOW','SUP-2026-101',NULL,'OPEN','Inquiry on luggage weight limit',1);
/*!40000 ALTER TABLE `support_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fare_amount` double NOT NULL,
  `issue_date` datetime(6) DEFAULT NULL,
  `passenger_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qr_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seat_number` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ticket_number` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_id` bigint DEFAULT NULL,
  `reservation_id` bigint NOT NULL,
  `trip_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_4ks48wgrew48dpkh0wd1rbe2b` (`ticket_number`),
  UNIQUE KEY `UK_kj0dxtedy796qlgt9ynq3ge3` (`reservation_id`),
  KEY `FKi81xre2n3j3as1sp24j440kq1` (`customer_id`),
  KEY `FKbcjlnu2low7r5vfimxextqab9` (`trip_id`),
  CONSTRAINT `FKbcjlnu2low7r5vfimxextqab9` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`),
  CONSTRAINT `FKi81xre2n3j3as1sp24j440kq1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `FKtefrntjvcsu43l1fjmybtqqmx` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES (1,850,'2026-09-13 18:27:30.823809','Nuwan Berugoda','QR_LT_RES_88901_1A','1A','ISSUED','TKT-2026-001',1,1,1);
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transport_events`
--

DROP TABLE IF EXISTS `transport_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transport_events` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `contact_phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `destination` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `end_date` date NOT NULL,
  `event_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `organizer_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `origin` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `required_buses` int NOT NULL,
  `required_capacity` int NOT NULL,
  `start_date` date NOT NULL,
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transport_events`
--

LOCK TABLES `transport_events` WRITE;
/*!40000 ALTER TABLE `transport_events` DISABLE KEYS */;
INSERT INTO `transport_events` VALUES (1,'+94 77 912 3456','2026-09-13 18:27:30.915103','BMICH Colombo','2026-09-24','SLIIT National Tech Symposium 2026','EXCURSION','Faculty of Computing','SLIIT Malabe Campus',2,80,'2026-09-23','CONFIRMED'),(2,'+94 71 334 5566','2026-09-13 18:27:30.919449','Jetwing Lighthouse Galle','2026-10-03','Southern Corporate Leadership Summit','CORPORATE','Apex Lanka Holdings','Colombo Fort',1,40,'2026-10-03','CONFIRMED');
/*!40000 ALTER TABLE `transport_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trips`
--

DROP TABLE IF EXISTS `trips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trips` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `arrival_time` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `available_seats` int NOT NULL,
  `departure_time` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fare_amount` double NOT NULL,
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_seats` int NOT NULL,
  `trip_code` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `trip_date` date NOT NULL,
  `bus_id` bigint NOT NULL,
  `driver_id` bigint NOT NULL,
  `route_id` bigint NOT NULL,
  `schedule_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_sp0nm9rujn2bx6kexw6uv35ks` (`trip_code`),
  KEY `FK2vg7b2xayoq4ogt2kbsot4juq` (`bus_id`),
  KEY `FKaq8aob3mymsvmh1fkko7k9ql9` (`driver_id`),
  KEY `FKm7ci3blm9wj2k0d94chu18y7s` (`route_id`),
  KEY `FKc4tbesbyjyouwihamhaof9o4u` (`schedule_id`),
  CONSTRAINT `FK2vg7b2xayoq4ogt2kbsot4juq` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`),
  CONSTRAINT `FKaq8aob3mymsvmh1fkko7k9ql9` FOREIGN KEY (`driver_id`) REFERENCES `drivers` (`id`),
  CONSTRAINT `FKc4tbesbyjyouwihamhaof9o4u` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`),
  CONSTRAINT `FKm7ci3blm9wj2k0d94chu18y7s` FOREIGN KEY (`route_id`) REFERENCES `routes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trips`
--

LOCK TABLES `trips` WRITE;
/*!40000 ALTER TABLE `trips` DISABLE KEYS */;
INSERT INTO `trips` VALUES (1,'08:30',38,'07:00',850,'SCHEDULED',40,'TRP-20260913-01','2026-09-13',2,2,1,1),(2,'18:00',40,'16:30',850,'SCHEDULED',40,'TRP-20260913-02','2026-09-13',2,2,1,2),(3,'11:30',40,'10:00',850,'SCHEDULED',40,'TRP-20260913-03','2026-09-13',2,2,2,3),(4,'20:30',40,'19:00',850,'SCHEDULED',40,'TRP-20260913-04','2026-09-13',2,2,2,4),(5,'09:30',40,'06:30',650,'SCHEDULED',40,'TRP-20260913-05','2026-09-13',1,1,3,5),(6,'17:00',40,'14:00',650,'SCHEDULED',40,'TRP-20260913-06','2026-09-13',1,1,3,6),(7,'14:00',40,'11:00',650,'SCHEDULED',40,'TRP-20260913-07','2026-09-13',1,1,4,7),(8,'21:00',40,'18:00',650,'SCHEDULED',40,'TRP-20260913-08','2026-09-13',1,1,4,8),(9,'10:30',44,'08:00',550,'SCHEDULED',44,'TRP-20260913-09','2026-09-13',3,3,5,9),(10,'15:30',44,'13:00',550,'SCHEDULED',44,'TRP-20260913-10','2026-09-13',3,3,6,10),(11,'11:00',40,'09:00',1100,'SCHEDULED',40,'TRP-20260913-11','2026-09-13',4,4,7,11),(12,'16:30',40,'14:30',1100,'SCHEDULED',40,'TRP-20260913-12','2026-09-13',4,4,8,12),(13,'05:00',36,'21:00',2400,'SCHEDULED',36,'TRP-20260913-13','2026-09-13',6,6,9,13),(14,'05:30',36,'21:30',2400,'SCHEDULED',36,'TRP-20260913-14','2026-09-13',6,6,10,14),(15,'12:00',40,'07:30',950,'SCHEDULED',40,'TRP-20260913-15','2026-09-13',7,7,11,15),(16,'18:30',40,'14:00',950,'SCHEDULED',40,'TRP-20260913-16','2026-09-13',7,7,12,16),(17,'12:00',44,'06:00',1250,'SCHEDULED',44,'TRP-20260913-17','2026-09-13',9,9,13,17),(18,'19:00',44,'13:00',1250,'SCHEDULED',44,'TRP-20260913-18','2026-09-13',9,9,14,18),(19,'12:00',40,'06:30',1600,'SCHEDULED',40,'TRP-20260913-19','2026-09-13',8,8,15,19),(20,'20:00',40,'14:30',1600,'SCHEDULED',40,'TRP-20260913-20','2026-09-13',8,8,16,20),(21,'08:45',35,'08:00',450,'SCHEDULED',35,'TRP-20260913-21','2026-09-13',10,10,17,21),(22,'11:45',35,'11:00',450,'SCHEDULED',35,'TRP-20260913-22','2026-09-13',10,10,18,22),(23,'11:30',40,'06:30',1100,'SCHEDULED',40,'TRP-20260913-23','2026-09-13',5,5,19,23),(24,'18:30',40,'13:30',1100,'SCHEDULED',40,'TRP-20260913-24','2026-09-13',5,5,20,24),(25,'11:15',40,'08:30',1450,'SCHEDULED',40,'TRP-20260913-25','2026-09-13',4,4,21,25),(26,'17:45',40,'15:00',1450,'SCHEDULED',40,'TRP-20260913-26','2026-09-13',4,4,22,26),(27,'08:30',40,'07:00',850,'SCHEDULED',40,'TRP-20260914-01','2026-09-14',2,2,1,1),(28,'18:00',40,'16:30',850,'SCHEDULED',40,'TRP-20260914-02','2026-09-14',2,2,1,2),(29,'11:30',40,'10:00',850,'SCHEDULED',40,'TRP-20260914-03','2026-09-14',2,2,2,3),(30,'20:30',40,'19:00',850,'SCHEDULED',40,'TRP-20260914-04','2026-09-14',2,2,2,4),(31,'09:30',40,'06:30',650,'SCHEDULED',40,'TRP-20260914-05','2026-09-14',1,1,3,5),(32,'17:00',40,'14:00',650,'SCHEDULED',40,'TRP-20260914-06','2026-09-14',1,1,3,6),(33,'14:00',40,'11:00',650,'SCHEDULED',40,'TRP-20260914-07','2026-09-14',1,1,4,7),(34,'21:00',40,'18:00',650,'SCHEDULED',40,'TRP-20260914-08','2026-09-14',1,1,4,8),(35,'10:30',44,'08:00',550,'SCHEDULED',44,'TRP-20260914-09','2026-09-14',3,3,5,9),(36,'15:30',44,'13:00',550,'SCHEDULED',44,'TRP-20260914-10','2026-09-14',3,3,6,10),(37,'11:00',40,'09:00',1100,'SCHEDULED',40,'TRP-20260914-11','2026-09-14',4,4,7,11),(38,'16:30',40,'14:30',1100,'SCHEDULED',40,'TRP-20260914-12','2026-09-14',4,4,8,12),(39,'05:00',36,'21:00',2400,'SCHEDULED',36,'TRP-20260914-13','2026-09-14',6,6,9,13),(40,'05:30',36,'21:30',2400,'SCHEDULED',36,'TRP-20260914-14','2026-09-14',6,6,10,14),(41,'12:00',40,'07:30',950,'SCHEDULED',40,'TRP-20260914-15','2026-09-14',7,7,11,15),(42,'18:30',40,'14:00',950,'SCHEDULED',40,'TRP-20260914-16','2026-09-14',7,7,12,16),(43,'12:00',44,'06:00',1250,'SCHEDULED',44,'TRP-20260914-17','2026-09-14',9,9,13,17),(44,'19:00',44,'13:00',1250,'SCHEDULED',44,'TRP-20260914-18','2026-09-14',9,9,14,18),(45,'12:00',40,'06:30',1600,'SCHEDULED',40,'TRP-20260914-19','2026-09-14',8,8,15,19),(46,'20:00',40,'14:30',1600,'SCHEDULED',40,'TRP-20260914-20','2026-09-14',8,8,16,20),(47,'08:45',35,'08:00',450,'SCHEDULED',35,'TRP-20260914-21','2026-09-14',10,10,17,21),(48,'11:45',35,'11:00',450,'SCHEDULED',35,'TRP-20260914-22','2026-09-14',10,10,18,22),(49,'11:30',40,'06:30',1100,'SCHEDULED',40,'TRP-20260914-23','2026-09-14',5,5,19,23),(50,'18:30',40,'13:30',1100,'SCHEDULED',40,'TRP-20260914-24','2026-09-14',5,5,20,24),(51,'11:15',40,'08:30',1450,'SCHEDULED',40,'TRP-20260914-25','2026-09-14',4,4,21,25),(52,'17:45',40,'15:00',1450,'SCHEDULED',40,'TRP-20260914-26','2026-09-14',4,4,22,26),(53,'08:30',40,'07:00',850,'SCHEDULED',40,'TRP-20260915-01','2026-09-15',2,2,1,1),(54,'18:00',40,'16:30',850,'SCHEDULED',40,'TRP-20260915-02','2026-09-15',2,2,1,2),(55,'11:30',40,'10:00',850,'SCHEDULED',40,'TRP-20260915-03','2026-09-15',2,2,2,3),(56,'20:30',40,'19:00',850,'SCHEDULED',40,'TRP-20260915-04','2026-09-15',2,2,2,4),(57,'09:30',40,'06:30',650,'SCHEDULED',40,'TRP-20260915-05','2026-09-15',1,1,3,5),(58,'17:00',40,'14:00',650,'SCHEDULED',40,'TRP-20260915-06','2026-09-15',1,1,3,6),(59,'14:00',40,'11:00',650,'SCHEDULED',40,'TRP-20260915-07','2026-09-15',1,1,4,7),(60,'21:00',40,'18:00',650,'SCHEDULED',40,'TRP-20260915-08','2026-09-15',1,1,4,8),(61,'10:30',44,'08:00',550,'SCHEDULED',44,'TRP-20260915-09','2026-09-15',3,3,5,9),(62,'15:30',44,'13:00',550,'SCHEDULED',44,'TRP-20260915-10','2026-09-15',3,3,6,10),(63,'11:00',40,'09:00',1100,'SCHEDULED',40,'TRP-20260915-11','2026-09-15',4,4,7,11),(64,'16:30',40,'14:30',1100,'SCHEDULED',40,'TRP-20260915-12','2026-09-15',4,4,8,12),(65,'05:00',36,'21:00',2400,'SCHEDULED',36,'TRP-20260915-13','2026-09-15',6,6,9,13),(66,'05:30',36,'21:30',2400,'SCHEDULED',36,'TRP-20260915-14','2026-09-15',6,6,10,14),(67,'12:00',40,'07:30',950,'SCHEDULED',40,'TRP-20260915-15','2026-09-15',7,7,11,15),(68,'18:30',40,'14:00',950,'SCHEDULED',40,'TRP-20260915-16','2026-09-15',7,7,12,16),(69,'12:00',44,'06:00',1250,'SCHEDULED',44,'TRP-20260915-17','2026-09-15',9,9,13,17),(70,'19:00',44,'13:00',1250,'SCHEDULED',44,'TRP-20260915-18','2026-09-15',9,9,14,18),(71,'12:00',40,'06:30',1600,'SCHEDULED',40,'TRP-20260915-19','2026-09-15',8,8,15,19),(72,'20:00',40,'14:30',1600,'SCHEDULED',40,'TRP-20260915-20','2026-09-15',8,8,16,20),(73,'08:45',35,'08:00',450,'SCHEDULED',35,'TRP-20260915-21','2026-09-15',10,10,17,21),(74,'11:45',35,'11:00',450,'SCHEDULED',35,'TRP-20260915-22','2026-09-15',10,10,18,22),(75,'11:30',40,'06:30',1100,'SCHEDULED',40,'TRP-20260915-23','2026-09-15',5,5,19,23),(76,'18:30',40,'13:30',1100,'SCHEDULED',40,'TRP-20260915-24','2026-09-15',5,5,20,24),(77,'11:15',40,'08:30',1450,'SCHEDULED',40,'TRP-20260915-25','2026-09-15',4,4,21,25),(78,'17:45',40,'15:00',1450,'SCHEDULED',40,'TRP-20260915-26','2026-09-15',4,4,22,26),(79,'08:30',40,'07:00',850,'SCHEDULED',40,'TRP-20260916-01','2026-09-16',2,2,1,1),(80,'18:00',40,'16:30',850,'SCHEDULED',40,'TRP-20260916-02','2026-09-16',2,2,1,2),(81,'11:30',40,'10:00',850,'SCHEDULED',40,'TRP-20260916-03','2026-09-16',2,2,2,3),(82,'20:30',40,'19:00',850,'SCHEDULED',40,'TRP-20260916-04','2026-09-16',2,2,2,4),(83,'09:30',40,'06:30',650,'SCHEDULED',40,'TRP-20260916-05','2026-09-16',1,1,3,5),(84,'17:00',40,'14:00',650,'SCHEDULED',40,'TRP-20260916-06','2026-09-16',1,1,3,6),(85,'14:00',40,'11:00',650,'SCHEDULED',40,'TRP-20260916-07','2026-09-16',1,1,4,7),(86,'21:00',40,'18:00',650,'SCHEDULED',40,'TRP-20260916-08','2026-09-16',1,1,4,8),(87,'10:30',44,'08:00',550,'SCHEDULED',44,'TRP-20260916-09','2026-09-16',3,3,5,9),(88,'15:30',44,'13:00',550,'SCHEDULED',44,'TRP-20260916-10','2026-09-16',3,3,6,10),(89,'11:00',40,'09:00',1100,'SCHEDULED',40,'TRP-20260916-11','2026-09-16',4,4,7,11),(90,'16:30',40,'14:30',1100,'SCHEDULED',40,'TRP-20260916-12','2026-09-16',4,4,8,12),(91,'05:00',36,'21:00',2400,'SCHEDULED',36,'TRP-20260916-13','2026-09-16',6,6,9,13),(92,'05:30',36,'21:30',2400,'SCHEDULED',36,'TRP-20260916-14','2026-09-16',6,6,10,14),(93,'12:00',40,'07:30',950,'SCHEDULED',40,'TRP-20260916-15','2026-09-16',7,7,11,15),(94,'18:30',40,'14:00',950,'SCHEDULED',40,'TRP-20260916-16','2026-09-16',7,7,12,16),(95,'12:00',44,'06:00',1250,'SCHEDULED',44,'TRP-20260916-17','2026-09-16',9,9,13,17),(96,'19:00',44,'13:00',1250,'SCHEDULED',44,'TRP-20260916-18','2026-09-16',9,9,14,18),(97,'12:00',40,'06:30',1600,'SCHEDULED',40,'TRP-20260916-19','2026-09-16',8,8,15,19),(98,'20:00',40,'14:30',1600,'SCHEDULED',40,'TRP-20260916-20','2026-09-16',8,8,16,20),(99,'08:45',35,'08:00',450,'SCHEDULED',35,'TRP-20260916-21','2026-09-16',10,10,17,21),(100,'11:45',35,'11:00',450,'SCHEDULED',35,'TRP-20260916-22','2026-09-16',10,10,18,22),(101,'11:30',40,'06:30',1100,'SCHEDULED',40,'TRP-20260916-23','2026-09-16',5,5,19,23),(102,'18:30',40,'13:30',1100,'SCHEDULED',40,'TRP-20260916-24','2026-09-16',5,5,20,24),(103,'11:15',40,'08:30',1450,'SCHEDULED',40,'TRP-20260916-25','2026-09-16',4,4,21,25),(104,'17:45',40,'15:00',1450,'SCHEDULED',40,'TRP-20260916-26','2026-09-16',4,4,22,26);
/*!40000 ALTER TABLE `trips` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('CUSTOMER','OPERATIONS_MANAGER','CUSTOMER_SERVICE_SUPERVISOR','TRANSPORT_PLANNING_OFFICER','FINANCE_ADMIN','BUS_DEPOT_SUPERVISOR','SYSTEM_ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UK_r43af9ap4edm43mmtq01oddj6` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2026-09-13 18:27:29.366846','admin@lankatransit.lk','System Administrator','$2a$10$/vZNQ.Trflt3zdj42rO4MOYwKApFYQeWkc/P/2uzmD9EfDP4ukY3a','+94 77 100 0001','SYSTEM_ADMIN','admin'),(2,'2026-09-13 18:27:29.457019','planner@lankatransit.lk','Hemantha Abeysinghe','$2a$10$vEBVRQEegGkXQZJjaMfX2eOtr9Gay58k2mL6CGwEO7MDI6IC4hZBy','+94 77 200 0002','TRANSPORT_PLANNING_OFFICER','planner'),(3,'2026-09-13 18:27:29.528502','supervisor@lankatransit.lk','Gayashan Nimjaya','$2a$10$P8yZKNw/Y08v68XW16iHj.GKyp/p9tfLuKIjcNGLCI3b9qkKaQQD2','+94 77 300 0003','CUSTOMER_SERVICE_SUPERVISOR','supervisor'),(4,'2026-09-13 18:27:29.598300','finance@lankatransit.lk','Kasun Perera','$2a$10$QKy9mZtCEfKricYu8esgUOP1Du9z6RtFxwMOleBMPLJd3c3xE.p6y','+94 77 400 0004','FINANCE_ADMIN','finance'),(5,'2026-09-13 18:27:29.668673','opsmanager@lankatransit.lk','Ilakkiya Sivakumaran','$2a$10$i4Pol5RlUs7N8wJ87sdcauJXmr2sH9Ck.IFLecjJm5f9mQoHM/fmu','+94 77 500 0005','OPERATIONS_MANAGER','opsmanager'),(6,'2026-09-13 18:27:29.737304','depot@lankatransit.lk','Nimal Jayakody','$2a$10$drN6iMqtKyK9ucEwR2YHPuAE9/2.RGIKGE5vwynLkXChacwZxiKW2','+94 77 600 0006','BUS_DEPOT_SUPERVISOR','depot'),(7,'2026-09-13 18:27:29.805123','customer@lankatransit.lk','Nuwan Berugoda','$2a$10$ewxr5wiB3nRufMoR0OAT.OcMurs.yodvXHnz2N2WpjVhJDuWv0RyW','+94 71 889 9123','CUSTOMER','customer'),(8,'2026-09-13 18:45:39.399729','samantha@gmnail.com','samantha','$2a$10$7KkFaci5Rt0yMCKoYl.VEeW3P4F7EIqeAq/ujH0ZlCnmQiZOoihTG','','CUSTOMER','sama');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `waiting_list`
--

DROP TABLE IF EXISTS `waiting_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `waiting_list` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `contact_phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `passenger_name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `requested_seats` int DEFAULT NULL,
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_id` bigint DEFAULT NULL,
  `trip_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbswa92ahwgrksi1v8jt8vmlgn` (`customer_id`),
  KEY `FK5h5l1o3cwxnbkflwh3wxcvk9c` (`trip_id`),
  CONSTRAINT `FK5h5l1o3cwxnbkflwh3wxcvk9c` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`),
  CONSTRAINT `FKbswa92ahwgrksi1v8jt8vmlgn` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `waiting_list`
--

LOCK TABLES `waiting_list` WRITE;
/*!40000 ALTER TABLE `waiting_list` DISABLE KEYS */;
/*!40000 ALTER TABLE `waiting_list` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-14 18:50:33
