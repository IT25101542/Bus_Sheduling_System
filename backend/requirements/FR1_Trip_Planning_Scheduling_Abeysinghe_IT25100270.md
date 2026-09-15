# University Software Engineering Group Project — Individual Functional Requirement Specification

# FUNCTIONAL REQUIREMENT 01 (FR-01 / UC-01)
## Trip Planning & Scheduling Management

---

### Student Attribution & Academic Details
- **Assigned Group Member:** Abeysinghe H.I.A
- **Student Registration Number:** IT25100270
- **Academic Degree:** BSc (Hons) in Information Technology / Software Engineering
- **Institution:** Sri Lanka Institute of Information Technology (SLIIT)
- **Module Name:** Software Engineering Project (Year 2 / Year 3)
- **Client Organization:** Lanka Transit Services (Pvt) Ltd

---

## 1. Requirement Scope & Business Objectives

### 1.1 Objective
The Trip Planning & Scheduling Management module provides the operational backbone of Lanka Transit Services. It enables transit operators, depot managers, and trip planners to systematically define intercity transit corridors, maintain bus fleet inventory, manage driver rosters, generate scheduled public bus departures, and log real-time transit delays with automated estimated time of arrival (ETA) recalculation.

### 1.2 Primary & Secondary Actors
- **Operations Manager (Primary):** Authorizes new route creations, reviews scheduling conflicts, and tracks operational delays.
- **Trip Planner (Primary):** Defines origin-destination paths, establishes stop sequences, and schedules recurring bus trips.
- **Bus Depot Supervisor (Secondary):** Manages coach operational statuses (ACTIVE, IN_SERVICE, MAINTENANCE) and inspects vehicle seating capacities.
- **System Administrator (Secondary):** Oversees global master data integrity and role permissions.

---

## 2. Detailed Functional Requirements (FR Specifications)

| Requirement ID | Feature / Use Case | Description | Business Rules & Constraints |
|:---|:---|:---|:---|
| **FR-1.1** | **Route Management** | Create, view, update, and delete intercity highway routes (e.g. EX01 Colombo-Galle, EX02 Colombo-Kandy). | Route number must be unique. Distance in KM must be greater than 0. |
| **FR-1.2** | **Route Stops Sequencing** | Define intermediate boarding/alighting stops along a route with arrival offsets. | Stop sequence numbers must be positive integers in chronological order. |
| **FR-1.3** | **Bus Fleet Registry** | Register buses with plate numbers, models, total seating capacities, and luxury categories (SUPER_LUXURY, LUXURY_AC, SEMI_LUXURY, NORMAL). | Bus number must follow Sri Lankan registration format (e.g., `ND-8899`, `WP-NC-1234`). |
| **FR-1.4** | **Driver Roster Management** | Maintain qualified commercial bus drivers with national license numbers and contact numbers. | Driver license number must be unique. Active status toggle. |
| **FR-1.5** | **Trip Scheduling & Conflict Check** | Schedule intercity trips pairing a Route, a Bus, a Driver, Departure Date, and Time. | **Conflict Validation Engine:** The system must verify that neither the selected Bus nor the selected Driver has an overlapping schedule within 4 hours of the departure time. |
| **FR-1.6** | **Trip Delay Logging** | Record unexpected highway delays, weather disruptions, or mechanical breakdowns. | Updates trip status to `DELAYED` and recalculates revised ETA. |

---

## 3. Backend Package Architecture & Source Code Mapping

All source code files for Member 1 reside in:
📂 `backend/src/main/java/com/lankatransit/system/tripplanning/`

### 3.1 Entities (`@Entity`)
1. **`Bus.java`**
   - Table: `buses`
   - Fields: `id` (PK), `busNumber` (Unique, VARCHAR), `model`, `busType` (Enum), `totalSeats` (INT), `status` (ACTIVE / MAINTENANCE), `depotLocation`.
2. **`Driver.java`**
   - Table: `drivers`
   - Fields: `id` (PK), `fullName`, `licenseNumber` (Unique), `phone`, `active` (BOOLEAN).
3. **`Route.java`**
   - Table: `routes`
   - Fields: `id` (PK), `routeNumber` (Unique), `originCity`, `destinationCity`, `distanceKm`, `estimatedDurationMinutes`, `active`.
   - Relationships: `@OneToMany` with `RouteStop`.
4. **`RouteStop.java`**
   - Table: `route_stops`
   - Fields: `id` (PK), `route_id` (FK), `stopName`, `sequenceOrder`, `distanceFromOriginKm`.
5. **`Schedule.java`**
   - Table: `schedules`
   - Fields: `id` (PK), `scheduleCode`, `route_id` (FK), `bus_id` (FK), `driver_id` (FK), `departureTime`, `arrivalTime`, `operatingDays`, `active`.
6. **`DelayLog.java`**
   - Table: `delay_logs`
   - Fields: `id` (PK), `trip_id` (FK), `delayMinutes`, `reason`, `reportedAt`, `revisedEta`.

### 3.2 Repositories (`@Repository`)
- `BusRepository.java`: `findByStatus(String status)`, `findByBusNumber(String busNumber)`
- `DriverRepository.java`: `findByActiveTrue()`, `findByLicenseNumber(String licenseNumber)`
- `RouteRepository.java`: `findByActiveTrue()`, `findByRouteNumber(String routeNumber)`
- `RouteStopRepository.java`: `findByRouteIdOrderBySequenceOrderAsc(Long routeId)`
- `ScheduleRepository.java`: `findByRouteId(Long routeId)`, `findByActiveTrue()`
- `DelayLogRepository.java`: `findByTripId(Long tripId)`

### 3.3 Data Transfer Objects (`DTOs`)
- `BusDto.java` (Bean Validation: `@NotBlank`, `@Min(10)`)
- `DriverDto.java` (Bean Validation: `@NotBlank`, `@Pattern`)
- `RouteDto.java` (Bean Validation: `@NotBlank`, `@Min(1)`)
- `RouteStopDto.java`
- `ScheduleDto.java`
- `DelayLogDto.java`

### 3.4 Service Implementation (`TripPlanningService.java`)
Key algorithmic logic implemented:
```java
// Conflict Detection: Ensures neither the Bus nor the Driver is double-scheduled
boolean hasBusConflict = tripRepository.existsByBusIdAndDepartureDateAndTimeRange(...);
if (hasBusConflict) {
    throw new ConflictException("Bus " + bus.getBusNumber() + " is already assigned to another departure at this time!");
}

boolean hasDriverConflict = tripRepository.existsByDriverIdAndDepartureDateAndTimeRange(...);
if (hasDriverConflict) {
    throw new ConflictException("Driver " + driver.getFullName() + " has an active duty shift overlapping this departure!");
}
```

### 3.5 REST Controllers
- `BusController.java` (`/api/buses`)
- `DriverController.java` (`/api/drivers`)
- `RouteController.java` (`/api/routes`)
- `ScheduleController.java` (`/api/schedules`)
- `DelayController.java` (`/api/delays`)

---

## 4. REST API Endpoint Reference

| HTTP Method | URL Path | Role Required | Description |
|:---:|:---|:---|:---|
| `GET` | `/api/routes` | Any Authenticated | Retrieve all intercity travel routes |
| `GET` | `/api/routes/{id}` | Any Authenticated | Get route details with sequenced stops |
| `POST` | `/api/routes` | `OPERATIONS_MANAGER`, `SYSTEM_ADMIN` | Register a new transit corridor |
| `PUT` | `/api/routes/{id}` | `OPERATIONS_MANAGER`, `SYSTEM_ADMIN` | Update route properties or stops |
| `DELETE` | `/api/routes/{id}` | `OPERATIONS_MANAGER`, `SYSTEM_ADMIN` | Deactivate/remove a route |
| `GET` | `/api/buses` | Any Authenticated | View all registered fleet coaches |
| `POST` | `/api/buses` | `BUS_DEPOT_SUPERVISOR`, `SYSTEM_ADMIN` | Add a new bus to inventory |
| `PUT` | `/api/buses/{id}` | `BUS_DEPOT_SUPERVISOR`, `SYSTEM_ADMIN` | Update bus maintenance status |
| `GET` | `/api/drivers` | Any Authenticated | Get list of licensed commercial drivers |
| `POST` | `/api/drivers` | `BUS_DEPOT_SUPERVISOR`, `SYSTEM_ADMIN` | Register a driver to roster |
| `GET` | `/api/schedules` | Any Authenticated | Retrieve published trip schedules |
| `POST` | `/api/schedules` | `OPERATIONS_MANAGER`, `SYSTEM_ADMIN` | Create a schedule with conflict check |
| `POST` | `/api/delays` | `OPERATIONS_MANAGER`, `SYSTEM_ADMIN` | Report delay and recalculate ETA |

---

## 5. Sample JSON Payloads

### POST `/api/routes` (Create Route)
```json
{
  "routeNumber": "EX04",
  "originCity": "Colombo",
  "destinationCity": "Badulla",
  "distanceKm": 230.5,
  "estimatedDurationMinutes": 330,
  "active": true
}
```

### POST `/api/schedules` (Create Schedule with Conflict Check)
```json
{
  "scheduleCode": "SCH-EX04-01",
  "routeId": 1,
  "busId": 2,
  "driverId": 3,
  "departureTime": "07:30",
  "arrivalTime": "13:00",
  "operatingDays": "DAILY",
  "active": true
}
```

---

## 6. University Viva Examination Defense Guide

**Q1: How does your module prevent a bus or driver from being scheduled for two trips at the same time?**  
*Answer:* In `TripPlanningService.java`, before persisting a new schedule or trip, the service queries `TripRepository` using a time-overlap validation query. If another active trip exists for the same `busId` or `driverId` on the same date where the departure-arrival intervals overlap, the service throws a `ConflictException`, which our Spring Boot `GlobalExceptionHandler` translates to a `409 Conflict` HTTP response with an informative error message.

**Q2: What design patterns did you apply in this backend module?**  
*Answer:* I applied the **Layered Architecture Pattern** (Controller &rarr; Service &rarr; Repository &rarr; Database), the **Data Transfer Object (DTO) Pattern** to decouple JPA entities from client communication, and the **Dependency Injection Pattern** via Spring Boot constructor injection.

**Q3: How do you handle validation of input data?**  
*Answer:* I used Jakarta Bean Validation annotations (`@NotBlank`, `@Min`, `@Pattern`) in the DTO layer, activated by `@Valid` in the controller endpoints. If constraints fail, Spring triggers a `MethodArgumentNotValidException`, returning a clean `400 Bad Request` with field-level feedback.
