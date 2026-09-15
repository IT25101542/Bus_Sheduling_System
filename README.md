# Lanka Transit Services (Pvt) Ltd
## Web-Based Bus Scheduling & Booking System
**Academic Course:** University Software Engineering Group Project  
**Group Size:** 6 Members (Modular Architecture)  
**Client:** Lanka Transit Services (Pvt) Ltd  

---

## 1. Project Overview
Lanka Transit Services (Pvt) Ltd is a leading intercity coach operator in Sri Lanka connecting major transport hubs (Colombo, Kandy, Galle, Matara, Jaffna, Trincomalee, Badulla, Anuradhapura, Batticaloa, Kurunegala). This web-based application replaces manual paper-based scheduling and fragmented booking processes with a centralized, responsive, modular platform.

The system is partitioned into **6 cleanly separated functional modules** designed for independent development, testing, and university viva demonstration.

---

## 2. Group Members & Module Attribution Table

| Member # | Student Name | Student Registration ID | Module Code | Assigned Functional Domain | Primary User Roles |
|:---:|:---|:---:|:---:|:---|:---|
| **Member 1** | **Abeysinghe H.I.A** | **IT25100270** | `UC-01` | **Trip Planning & Scheduling Management** | Operations Manager, Depot Supervisor, Fleet Dispatcher |
| **Member 2** | **Jayakody J.A.K.Y** | **IT25101542** | `UC-02` | **Reservation Management & Seat Allocation** | Customer, Booking Agent, Operations Staff |
| **Member 3** | **Perera M.G.K** | **IT25103360** | `UC-03` | **Ticketing & Fare Management** | Finance Admin, Passenger, Ticket Conductor |
| **Member 4** | **Berugoda B.A.N.R** | **IT25103022** | `UC-04` | **Loyalty Rewards & Customer Perks** | Customer, Finance Admin, Marketing Officer |
| **Member 5** | **Nimjaya G.S.** | **IT25102352** | `UC-05` | **Customer Service & Grievance Lifecycle** | Customer Service Supervisor, Passenger |
| **Member 6** | **Ilakkiya. S** | **IT25101077** | `UC-06` | **Special Event & Bulk Transport Logistics** | Operations Manager, Event Coordinator, Depot Staff |

---

## 3. Technology Stack & Directory Structure

```
Group project 02/
├── backend/                       # Spring Boot 3.2.3 REST Monolithic Core (Java 17)
│   ├── src/main/java/com/lankatransit/system/
│   │   ├── auth/                  # JWT Authentication & Customer Management
│   │   ├── common/                # Shared ApiResponse & Role Enum
│   │   ├── config/                # SecurityConfig, CorsConfig, DataInitializer
│   │   ├── tripplanning/          # Member 1: Buses, Drivers, Routes, Schedules, Delays
│   │   ├── reservation/           # Member 2: Trips, Seats, Reservations, Waiting List
│   │   ├── ticketing/             # Member 3: Fare Rules, Tickets, Payments, Refunds
│   │   ├── loyalty/               # Member 4: Programs, Accounts, Transactions, Vouchers
│   │   ├── customerservice/       # Member 5: Complaints, Support, Feedbacks, Alerts
│   │   ├── eventtransport/        # Member 6: Transport Events, Trips, Manifests
│   │   └── dashboard/             # Aggregated KPI Analytics Endpoint
│   ├── src/main/resources/        # application.properties (MySQL) & application-h2.properties
│   ├── tools/apache-maven-3.9.9/  # Pre-bundled portable Apache Maven
│   ├── mvnw.cmd                   # Turnkey Maven wrapper configured with JDK 17
│   └── pom.xml                    # Maven dependencies
├── frontend/                      # React 18 + Vite 5 Modern Responsive SPA
│   ├── src/
│   │   ├── api/                   # Axios client with JWT request interceptor
│   │   ├── auth/                  # AuthContext, ProtectedRoute, role authorization
│   │   ├── components/            # MemberBadge (viva attribution), Navbar, Sidebar, Modal
│   │   ├── layouts/               # MainLayout (public) & DashboardLayout (private)
│   │   ├── modules/
│   │   │   ├── tripPlanning/      # Member 1 pages (Schedules, Routes, Buses, Drivers, Delays)
│   │   │   ├── reservation/       # Member 2 pages (Reservations, Interactive Seat Map, Waiting List)
│   │   │   ├── ticketing/         # Member 3 pages (Fare Rules, E-Tickets, Payments, Refunds, Reports)
│   │   │   ├── loyaltyRewards/    # Member 4 pages (Programs, Points Balance, Redeem Store, Ledger)
│   │   │   ├── customerService/   # Member 5 pages (Complaints, Support Inquiries, Reviews, Alerts)
│   │   │   └── eventTransport/    # Member 6 pages (Events, Fleet Dispatch, Manifests, Utilization)
│   │   ├── pages/                 # HomePage, SearchTripsPage, LoginPage, RegisterPage, DashboardPage
│   │   └── styles/                # Clean styling (Sri Lanka Navy & Amber theme)
│   └── package.json               # Frontend dependencies
├── database/                      # Relational Database Scripts
│   ├── schema.sql                 # Complete normalized DDL (26 Relational Tables)
│   ├── data.sql                   # Realistic seed data (Routes, Buses, Users, Fares, Bookings)
│   └── README_DB.md               # Step-by-step MySQL & XAMPP setup instructions
├── run-backend.bat                # 1-Click script to launch Spring Boot backend
├── run-frontend.bat               # 1-Click script to launch Vite React frontend
├── start-all.bat                  # 1-Click turnkey master runner
└── README.md                      # Complete Project Documentation
```

---

## 4. Quick Start & Execution Guide

### Option A: 1-Click Turnkey Start (Windows)
Double-click `start-all.bat` in the root folder.  
This automatically launches both the backend and frontend in separate command windows.
- **Frontend URL:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:8080/api](http://localhost:8080/api)

---

### Option B: Manual Terminal Execution

#### 1. Database Setup (MySQL)
Run the following in MySQL CLI or phpMyAdmin / MySQL Workbench:
```sql
CREATE DATABASE IF NOT EXISTS lanka_transit_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lanka_transit_db;
SOURCE database/schema.sql;
SOURCE database/data.sql;
```
*(Note: If MySQL is not installed, the application will automatically initialize all tables and seed records on first launch via Hibernate JPA).*

#### 2. Backend Start
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

#### 3. Frontend Start
```powershell
cd frontend
npm.cmd run dev
```

---

## 5. Seed Demonstration User Accounts & 1-Click Viva Demo

The login screen (`/login`) includes **1-Click Quick Login buttons** for each role, allowing instant access during your university viva presentation without typing credentials manually:

| Role Title | Username / Email | Password | Allowed Access Scope |
|:---|:---|:---|:---|
| **System Administrator** | `admin@lankatransit.lk` | `Admin@123` | Full access across all 6 modules & system configuration |
| **Operations Manager** | `ops@lankatransit.lk` | `Ops@123` | Trip scheduling, delay logging, fleet dispatch, event transport |
| **Bus Depot Supervisor** | `depot@lankatransit.lk` | `Depot@123` | Bus maintenance, driver allocation, vehicle rosters |
| **Finance Administrator** | `finance@lankatransit.lk` | `Finance@123` | Fare rules, payments ledger, ticket refunds, revenue reports |
| **Customer Service Supervisor**| `supervisor@lankatransit.lk`| `Supervisor@123`| Complaint resolution, support inquiries, service alerts |
| **Trip Planner** | `planner@lankatransit.lk` | `Planner@123` | Routes, timetable creation, stop sequencing |
| **Customer / Passenger** | `customer@lankatransit.lk` | `Customer@123` | Interactive seat booking, e-tickets, loyalty perks, reviews |

---

## 6. Viva Demonstration Workflow by Member

### Member 1: Abeysinghe H.I.A (IT25100270) - Trip Planning & Scheduling
1. Log in as **Operations Manager** or **Trip Planner**.
2. Navigate to **Trip Planning &rarr; Routes & Stops**: View expressway routes (EX01 Southern, EX02 Central, A1 Colombo-Kandy). Demonstrate creating a new route stop.
3. Navigate to **Trip Planning &rarr; Buses Fleet**: View bus registry with status (ACTIVE, IN_SERVICE, MAINTENANCE).
4. Navigate to **Trip Planning &rarr; Drivers Roster**: View drivers with license verification.
5. Navigate to **Trip Planning &rarr; Schedules**: Click **Create Trip Schedule**. Demonstrate the built-in **Conflict Validation Engine**—if a bus or driver is scheduled with overlapping hours, the system blocks the conflict and alerts the planner!
6. Navigate to **Trip Planning &rarr; Trip Delays**: Log a delay (e.g. Weather, Traffic Congestion) with new estimated arrival time.

### Member 2: Jayakody J.A.K.Y (IT25101542) - Reservation Management
1. Log in as **Customer** or go to public **Home &rarr; Search Trips** (`/search`).
2. Search for Colombo &rarr; Kandy or Galle.
3. Select an available trip and click **Select Seats**.
4. Demonstrate the **Interactive 2x2 Bus Seat Map**:
   - Visual color coding: Available (white), Selected (amber), Reserved (gray), Driver cabin.
   - Click to pick seats. Total fare updates dynamically.
5. Confirm booking and enter passenger details. Demonstrate thread-safe seat locking.
6. Navigate to **Reservations &rarr; All Bookings**: View booking details, modify passenger details, or cancel reservation.
7. Navigate to **Reservations &rarr; Waiting List**: Join waiting list for fully booked buses; view automated queue position and alternative trip suggestions.

### Member 3: Perera M.G.K (IT25103360) - Ticketing & Fare Management
1. Log in as **Finance Administrator**.
2. Navigate to **Ticketing & Fare &rarr; Fare Rules**:
   - Demonstrate the **Live Dynamic Fare Calculator Engine**: Select route, passenger category (Adult/Child/Student/Senior), and bus class. Shows formula calculation: `(Base Price + [Per KM Rate * Distance] * Multiplier) * (1 - Discount%)`.
   - Add or edit fare rules.
3. Navigate to **Ticketing & Fare &rarr; Electronic Tickets**:
   - Click **View Pass** on any issued ticket.
   - Shows formatted **Boarding Pass (E-Ticket)** with official header, journey details, and **scannable QR Code** with verification token. Click **Print Pass**.
4. Navigate to **Ticketing & Fare &rarr; Payments Ledger**: View transaction audit trail with printable receipts.
5. Navigate to **Ticketing & Fare &rarr; Refund Requests**: Process ticket cancellation refunds according to time-bracket refund policy (100%, 90%, 75%, 50%).
6. Navigate to **Ticketing & Fare &rarr; Financial Reports**: Real-time revenue analytics, refund volume, net margin, and corridor performance.

### Member 4: Berugoda B.A.N.R (IT25103022) - Loyalty Rewards Management
1. Log in as **Customer**.
2. Navigate to **Loyalty Rewards &rarr; Points Balance**:
   - Demonstrates membership card (Tier: SILVER, GOLD, PLATINUM), lifetime earned points, current balance, and tier progression bar.
3. Navigate to **Loyalty Rewards &rarr; Redeem Vouchers**:
   - Browse voucher catalog: 10% Fare Voucher (100 pts), AC Upgrade (150 pts), 25% Super Saver (250 pts), Free Coach Ticket (500 pts).
   - Demonstrates balance validation: if customer points < cost, button is disabled with remaining points needed.
   - Click **Redeem**: Points are deducted instantly, and a unique coupon code (`LT-RWD-XXXXXX`) is generated!
4. Navigate to **Loyalty Rewards &rarr; Reward History**: Review immutable audit ledger of EARNED vs REDEEMED points with timestamps.
5. Log in as **Finance Admin** and go to **Reward Programs**: Manage tier criteria, multipliers, and discounts.

### Member 5: Nimjaya G.S. (IT25102352) - Customer Service Management
1. Log in as **Customer**.
2. Navigate to **Customer Service &rarr; Complaints**: Click **Log Complaint**. Select category (Bus Condition, Driver Conduct, Schedule Delay, Fare Dispute, Lost Property), enter details, and submit.
3. Log in as **Customer Service Supervisor**:
   - View grievance incident tracker.
   - Open complaint and transition status through its lifecycle: `OPEN` &rarr; `IN_PROGRESS` &rarr; `RESOLVED` &rarr; `CLOSED`.
   - Add supervisor resolution notes and corrective actions.
4. Navigate to **Customer Service &rarr; Support Requests**: Manage passenger helpdesk inquiries and dispatch agent replies.
5. Navigate to **Customer Service &rarr; Feedback & Ratings**:
   - View overall passenger satisfaction score (e.g. 4.8 / 5.0) and star ratings.
   - Submit new trip review.
6. Navigate to **Customer Service &rarr; Notifications**: View service bulletins. Supervisor can broadcast emergency delay notices to all passengers.

### Member 6: Ilakkiya. S (IT25101077) - Special Event Transport Management
1. Log in as **Operations Manager**.
2. Navigate to **Event Transport &rarr; Transport Events**:
   - View private bulk charters (Corporate outings, sports tournaments, university excursions, pilgrimages).
   - Register a new event charter with required buses and passenger capacity quota.
3. Navigate to **Event Transport &rarr; Event Fleet**:
   - Select an event and click **Assign Coach**.
   - Select bus and driver. System automatically validates coach availability so depot buses are not double-booked!
4. Navigate to **Event Transport &rarr; Passenger Manifests**:
   - View official passenger manifest with contact numbers, emergency contacts, and assigned seats.
   - Add participant to event.
   - Click **Check In / Boarded** toggle to simulate gate check-in at the bus door. Live turnout progress bar updates immediately.
5. Navigate to **Event Transport &rarr; Event Reports**: Fleet deployment metrics, capacity utilization %, and checked-in turnout rates.

---

## 7. Key REST API Matrix

| Module | Method | Endpoint | Description |
|:---|:---:|:---|:---|
| **Auth** | POST | `/api/auth/login` | JWT authentication and role claim issue |
| **Auth** | POST | `/api/auth/register` | Customer self-registration |
| **Trip Planning** | GET/POST | `/api/routes` | Route configuration with distance and stops |
| **Trip Planning** | GET/POST | `/api/buses` | Fleet inventory and coach classifications |
| **Trip Planning** | GET/POST | `/api/drivers` | Driver licenses and contact roster |
| **Trip Planning** | GET/POST | `/api/schedules` | Trip scheduling with conflict detection |
| **Trip Planning** | GET/POST | `/api/delays` | Trip delay logging and ETA tracking |
| **Reservation** | GET | `/api/trips` | Public trip catalog with available seats |
| **Reservation** | GET | `/api/trips/{id}` | Real-time seat allocation map for trip |
| **Reservation** | POST | `/api/reservations` | Double-booking protected seat booking |
| **Reservation** | GET/POST | `/api/waiting-list` | Priority waitlist queue and alternative trips |
| **Ticketing** | GET/POST | `/api/fares` | Fare rules and dynamic tariff calculator |
| **Ticketing** | GET/POST | `/api/tickets` | E-ticket issuance with validation QR codes |
| **Ticketing** | GET/POST | `/api/payments` | Mock card/cash settlements & transaction ledger |
| **Ticketing** | GET/POST | `/api/refunds` | Tiered refund claims processing |
| **Loyalty** | GET/POST | `/api/rewards/programs` | Membership tier levels & multipliers |
| **Loyalty** | GET | `/api/rewards/account/{id}` | Customer points balance and tier level |
| **Loyalty** | POST | `/api/rewards/redeem` | Voucher store points redemption |
| **Customer Service**| GET/POST | `/api/complaints` | Grievance ticket lifecycle tracker |
| **Customer Service**| PUT | `/api/complaints/{id}/status` | Supervisor status resolution |
| **Customer Service**| GET/POST | `/api/feedbacks` | Star ratings and trip reviews |
| **Customer Service**| GET/POST | `/api/notifications` | Service alerts and broadcast bulletins |
| **Event Transport** | GET/POST | `/api/events` | Bulk charter contracts and itineraries |
| **Event Transport** | GET/POST | `/api/events/{id}/trips` | Dedicated fleet assignment with validation |
| **Event Transport** | GET/POST | `/api/events/{id}/passengers`| Passenger manifests & gate check-in toggle |
| **Event Transport** | GET | `/api/events/reports/all` | Fleet utilization logistics reports |

---

## 8. University Viva Defense Highlights
- **Individual Student Attribution:** Every module page displays an official university banner (`MemberBadge`) prominently attributing the student name, registration number, module code, and primary actors.
- **Physical Architecture Separation:** Clean separation of concerns with `/frontend` (React SPA), `/backend` (Spring Boot REST), and `/database` (SQL DDL/DML).
- **Business Logic Enforcement:** Real-time seat locking, conflict detection preventing bus/driver double-scheduling, mathematical dynamic fare formulas, points balance checks, and structured complaint lifecycle workflows.
- **Zero-Config Turnkey Execution:** Bundled with pre-configured Maven wrapper, OpenJDK 17 integration, sample seed data, and 1-click batch launchers.
