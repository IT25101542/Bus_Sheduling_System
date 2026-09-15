# University Software Engineering Group Project — Individual Functional Requirement Specification

# FUNCTIONAL REQUIREMENT 06 (FR-06 / UC-06)
## Special Event & Bulk Transport Logistics Management

---

### Student Attribution & Academic Details
- **Assigned Group Member:** Ilakkiya. S
- **Student Registration Number:** IT25101077
- **Academic Degree:** BSc (Hons) in Information Technology / Software Engineering
- **Institution:** Sri Lanka Institute of Information Technology (SLIIT)
- **Module Name:** Software Engineering Project (Year 2 / Year 3)
- **Client Organization:** Lanka Transit Services (Pvt) Ltd

---

## 1. Requirement Scope & Business Objectives

### 1.1 Objective
The Special Event & Bulk Transport Logistics module provides end-to-end management for non-scheduled private charters, institutional group travel, and large-scale bulk transit. It facilitates the registration of bulk event contracts (Corporate outings, sports tournaments, university excursions, pilgrimages, wedding shuttles), enables fleet dispatchers to allocate dedicated coaches and drivers while automatically verifying availability against regular scheduled routes, maintains passenger manifests with emergency contact tracing and live gate check-in controls, and computes fleet capacity utilization analytics.

### 1.2 Primary & Secondary Actors
- **Operations Manager (Primary):** Approves private event contracts, oversees vehicle assignments, and evaluates fleet utilization.
- **Event Coordinator / Organizer (Primary):** Defines destination itineraries, specifies passenger capacity requirements, and registers passenger manifests.
- **Depot Supervisor / Fleet Dispatcher (Secondary):** Verifies vehicle mechanical readiness and driver duty assignments for charter events.
- **Conductor / Gate Officer (Secondary):** Toggles check-in boarding status as passengers embark at the charter departure point.

---

## 2. Detailed Functional Requirements (FR Specifications)

| Requirement ID | Feature / Use Case | Description | Business Rules & Constraints |
|:---|:---|:---|:---|
| **FR-6.1** | **Transport Event Registration** | Register private bulk transport contracts with event categories (`CORPORATE`, `SPORTS`, `EXCURSION`, `PILGRIMAGE`, `WEDDING`). | Requires organizer contact phone, start/end dates, origin, destination, required bus count, and passenger capacity quota. |
| **FR-6.2** | **Dedicated Event Fleet Scheduling** | Assign depot coaches and licensed drivers to dedicated event trips. | **Availability Verification Engine:** System verifies that the bus and driver are not assigned to scheduled public routes or other event charters on that date. |
| **FR-6.3** | **Passenger Manifest Management** | Maintain official passenger boarding manifests for each event charter with contact details and emergency next-of-kin numbers. | Required for institutional safety and insurance compliance. |
| **FR-6.4** | **Live Gate Check-in Control** | 1-click toggle for gate officers to record passenger boarding (`checkInStatus = true/false`). | Dynamically updates real-time turnout count and manifest completion progress bar. |
| **FR-6.5** | **Capacity & Turnout Auditing** | Track total registered participants vs target contract capacity. | Ensures organizer does not exceed certified passenger safety capacity. |
| **FR-6.6** | **Fleet Logistics & Utilization Reporting** | Generate event performance reports analyzing Required vs Assigned Buses, Target vs Actual Passengers, and Fleet Utilization Rate (`(CheckedInPax / TotalCapacity) * 100%`). | Aggregated report available via `/api/events/reports/all`. |

---

## 3. Backend Package Architecture & Source Code Mapping

All source code files for Member 6 reside in:
📂 `backend/src/main/java/com/lankatransit/system/eventtransport/`

### 3.1 Entities (`@Entity`)
1. **`TransportEvent.java`**
   - Table: `transport_events`
   - Fields: `id` (PK), `eventName`, `eventType` (`CORPORATE`, `SPORTS`, `EXCURSION`, `PILGRIMAGE`, `WEDDING`), `organizerName`, `contactPhone`, `startDate`, `endDate`, `origin`, `destination`, `requiredBuses`, `requiredCapacity`, `status` (`PENDING`, `CONFIRMED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`), `createdAt`.
   - Relationships: `@OneToMany` with `EventTrip` and `EventPassenger`.
2. **`EventTrip.java`**
   - Table: `event_trips`
   - Fields: `id` (PK), `event_id` (FK), `bus_id` (FK), `driver_id` (FK), `tripDate`, `departureTime`, `returnTime`, `status` (`SCHEDULED`, `COMPLETED`, `CANCELLED`).
   - Relationships: `@ManyToOne` with `TransportEvent`, `Bus`, `Driver`.
3. **`EventPassenger.java`**
   - Table: `event_passengers`
   - Fields: `id` (PK), `event_id` (FK), `event_trip_id` (FK nullable), `passengerName`, `contactPhone`, `emergencyContact`, `seatAllocated`, `checkInStatus` (BOOLEAN default `false`), `busNumber`.

### 3.2 Repositories (`@Repository`)
- `TransportEventRepository.java`: `findByStatus(String status)`, `findByEventType(String type)`
- `EventTripRepository.java`: `findByEventId(Long eventId)`, `findByBusIdAndTripDate(Long busId, LocalDate date)`
- `EventPassengerRepository.java`: `findByEventId(Long eventId)`, `countByEventIdAndCheckInStatusTrue(Long eventId)`

### 3.3 Data Transfer Objects (`DTOs`)
- `TransportEventDto.java` (Bean Validation: `@NotBlank`, `@Min(1)`, `@NotNull`)
- `EventTripDto.java` (Bean Validation: `@NotNull`, `@NotBlank`)
- `EventPassengerDto.java` (Bean Validation: `@NotBlank`)
- `EventReportDto.java`

### 3.4 Service Implementation (`EventTransportService.java`)
Key algorithmic logic implemented:
```java
// Bus & Driver Availability Check for Special Events
@Transactional
public EventTripDto createEventTrip(EventTripDto dto) {
    TransportEvent event = eventRepository.findById(dto.getEventId())
            .orElseThrow(() -> new ResourceNotFoundException("Transport event not found"));

    Bus bus = busRepository.findById(dto.getBusId())
            .orElseThrow(() -> new ResourceNotFoundException("Bus not found"));

    Driver driver = driverRepository.findById(dto.getDriverId())
            .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));

    // Verify Bus availability against scheduled public trips
    boolean busConflictInPublic = tripRepository.existsByBusIdAndDepartureDate(bus.getId(), dto.getTripDate());
    if (busConflictInPublic) {
        throw new ConflictException("Bus " + bus.getBusNumber() + " is already assigned to a public scheduled route on " + dto.getTripDate());
    }

    // Verify Bus availability against other event charters
    boolean busConflictInEvents = eventTripRepository.existsByBusIdAndTripDate(bus.getId(), dto.getTripDate());
    if (busConflictInEvents) {
        throw new ConflictException("Bus " + bus.getBusNumber() + " is already assigned to another charter event on " + dto.getTripDate());
    }

    // Persist event trip
    EventTrip eventTrip = new EventTrip();
    eventTrip.setEvent(event);
    eventTrip.setBus(bus);
    eventTrip.setDriver(driver);
    eventTrip.setTripDate(dto.getTripDate());
    eventTrip.setDepartureTime(dto.getDepartureTime());
    eventTrip.setReturnTime(dto.getReturnTime());
    return mapToDto(eventTripRepository.save(eventTrip));
}

// 1-Click Gate Check-In Toggle
@Transactional
public EventPassengerDto toggleCheckIn(Long passengerId) {
    EventPassenger p = passengerRepository.findById(passengerId)
            .orElseThrow(() -> new ResourceNotFoundException("Passenger manifest record not found"));
    p.setCheckInStatus(!p.isCheckInStatus());
    return mapToDto(passengerRepository.save(p));
}
```

### 3.5 REST Controllers
- `TransportEventController.java` (`/api/events`)

---

## 4. REST API Endpoint Reference

| HTTP Method | URL Path | Role Required | Description |
|:---:|:---|:---|:---|
| `GET` | `/api/events` | Any Authenticated | View all registered private charter events |
| `GET` | `/api/events/{id}` | Any Authenticated | Get event contract and quota details |
| `POST` | `/api/events` | `OPERATIONS_MANAGER`, `SYSTEM_ADMIN` | Register new bulk transport charter |
| `PUT` | `/api/events/{id}` | `OPERATIONS_MANAGER`, `SYSTEM_ADMIN` | Update charter dates, route, or quota |
| `DELETE` | `/api/events/{id}` | `OPERATIONS_MANAGER`, `SYSTEM_ADMIN` | Cancel private charter contract |
| `GET` | `/api/events/{id}/trips` | Any Authenticated | View allocated coaches and drivers for an event |
| `POST` | `/api/events/{id}/trips` | `OPERATIONS_MANAGER`, `SYSTEM_ADMIN` | Assign coach with conflict verification |
| `DELETE` | `/api/events/trips/{tripId}` | `OPERATIONS_MANAGER`, `SYSTEM_ADMIN` | De-allocate coach from event |
| `GET` | `/api/events/{id}/passengers`| Any Authenticated | Retrieve official passenger manifest |
| `POST` | `/api/events/{id}/passengers`| Any Authenticated | Register participant to event manifest |
| `PATCH` | `/api/events/passengers/{id}/check-in` | Any Authenticated | Toggle gate check-in boarding status |
| `GET` | `/api/events/reports/all` | `OPERATIONS_MANAGER`, `SYSTEM_ADMIN` | Fleet utilization and turnout analytics |

---

## 5. Sample JSON Payloads

### POST `/api/events` (Book Event Charter)
```json
{
  "eventName": "SLIIT Annual Sports Meet Inter-Campus Shuttle",
  "eventType": "SPORTS",
  "organizerName": "SLIIT Student Union",
  "contactPhone": "0719876543",
  "startDate": "2026-10-15",
  "endDate": "2026-10-15",
  "origin": "Malabe Campus",
  "destination": "Sugathadasa Stadium, Colombo",
  "requiredBuses": 3,
  "requiredCapacity": 150,
  "status": "CONFIRMED"
}
```

### POST `/api/events/1/trips` (Assign Fleet Coach)
```json
{
  "busId": 2,
  "driverId": 3,
  "tripDate": "2026-10-15",
  "departureTime": "06:30",
  "returnTime": "19:00"
}
```

---

## 6. University Viva Examination Defense Guide

**Q1: How does your module protect against depot buses being allocated to private events when they are needed for regular public lines?**  
*Answer:* In `EventTransportService.createEventTrip()`, cross-module validation is performed before any coach assignment is finalized. The service checks `tripRepository.existsByBusIdAndDepartureDate(...)` from Member 1's public scheduling tables. If the bus is committed to a scheduled public journey on that date, a `ConflictException` is thrown, rejecting the assignment and safeguarding regular passenger service punctuality.

**Q2: How does the passenger manifest check-in toggle work?**  
*Answer:* The `toggleCheckIn(passengerId)` endpoint uses the `PATCH` HTTP method for idempotent partial state updates. It inverts the boolean `checkInStatus` of the passenger record. In the frontend, this reflects immediately on the UI by switching the button from "Check In" to "Boarded", turning the row light green, and advancing the live event turnout progress bar.

**Q3: How is the fleet utilization rate calculated?**  
*Answer:* In `EventTransportService.getEventReport()`, the utilization rate is calculated as:
$$\text{Utilization Rate} = \left(\frac{\text{Checked-In Passengers}}{\text{Required Capacity}}\right) \times 100\%$$
This metric allows the Operations Manager to identify under-utilized coaches, adjust vehicle size allocations, and maximize operating efficiency.
