# University Software Engineering Group Project — Individual Functional Requirement Specification

# FUNCTIONAL REQUIREMENT 02 (FR-02 / UC-02)
## Reservation Management & Seat Allocation

---

### Student Attribution & Academic Details
- **Assigned Group Member:** Jayakody J.A.K.Y
- **Student Registration Number:** IT25101542
- **Academic Degree:** BSc (Hons) in Information Technology / Software Engineering
- **Institution:** Sri Lanka Institute of Information Technology (SLIIT)
- **Module Name:** Software Engineering Project (Year 2 / Year 3)
- **Client Organization:** Lanka Transit Services (Pvt) Ltd

---

## 1. Requirement Scope & Business Objectives

### 1.1 Objective
The Reservation Management & Seat Allocation module handles the core consumer transaction lifecycle for Lanka Transit Services. It provides real-time seat inventory visibility via an interactive 2x2 coach layout, enforces atomic thread-safe seat locking to prevent double-booking, facilitates booking modifications and cancellations with automatic seat freeing, and manages an automated FIFO priority waiting list for sold-out departures with intelligent alternative trip recommendations.

### 1.2 Primary & Secondary Actors
- **Passenger / Customer (Primary):** Searches trip timetables, visually selects vacant seats, enters passenger details, and manages personal bookings.
- **Ticket Booking Agent (Primary):** Performs counter bookings and modifies passenger reservations upon request.
- **Operations Manager (Secondary):** Monitors passenger occupancy load factors and waitlist queue thresholds.
- **System Administrator (Secondary):** Audits booking references and transactional consistency.

---

## 2. Detailed Functional Requirements (FR Specifications)

| Requirement ID | Feature / Use Case | Description | Business Rules & Constraints |
|:---|:---|:---|:---|
| **FR-2.1** | **Trip Catalog & Search** | Search scheduled bus journeys by Origin, Destination, and Travel Date. | Displays departure/arrival times, bus comfort class, available seat count, and standard base fares. |
| **FR-2.2** | **Seat Map Visualization** | Fetch real-time seat status for a specific trip (2x2 layout: Window, Aisle, Left, Right). | Statuses: `AVAILABLE` (vacant), `BOOKED` (allocated). Prevents selecting already booked seats. |
| **FR-2.3** | **Seat Reservation Creation** | Book one or more seats for designated passengers with contact credentials. | **Concurrency Protection:** Atomic transaction prevents race conditions and double-booking. Decrements trip `availableSeats`. Generates unique `bookingReference` (e.g. `LT-BK-XXXXXX`). |
| **FR-2.4** | **Reservation Modification** | Modify passenger name, phone number, or transfer to an unoccupied seat on the same coach. | Old seat is freed back to `AVAILABLE`; new seat is atomically locked. |
| **FR-2.5** | **Reservation Cancellation** | Cancel an active reservation prior to coach departure. | Sets reservation status to `CANCELLED` and automatically marks the seat back to `AVAILABLE`. Increments trip `availableSeats`. |
| **FR-2.6** | **Waiting List Queue** | Place passengers on an automated priority queue when a trip reaches zero available seats. | FIFO (First-In-First-Out) queue. Automatically suggests nearby alternate departures on the same corridor. |

---

## 3. Backend Package Architecture & Source Code Mapping

All source code files for Member 2 reside in:
📂 `backend/src/main/java/com/lankatransit/system/reservation/`

### 3.1 Entities (`@Entity`)
1. **`Trip.java`**
   - Table: `trips`
   - Fields: `id` (PK), `tripNumber` (Unique, VARCHAR), `schedule_id` (FK), `route_id` (FK), `bus_id` (FK), `driver_id` (FK), `departureDate`, `departureTime`, `arrivalTime`, `availableSeats`, `fareAmount`, `status` (`SCHEDULED`, `DELAYED`, `COMPLETED`, `CANCELLED`).
   - Relationships: `@ManyToOne` with `Route`, `Bus`, `Driver`.
2. **`Seat.java`**
   - Table: `seats`
   - Fields: `id` (PK), `trip_id` (FK), `seatNumber` (e.g. `1A`, `1B`, `2C`, `2D`), `seatRow`, `seatColumn`, `seatType` (`WINDOW`, `AISLE`), `status` (`AVAILABLE`, `BOOKED`, `BLOCKED`).
3. **`Reservation.java`**
   - Table: `reservations`
   - Fields: `id` (PK), `bookingReference` (Unique), `customer_id` (FK nullable for walk-ins), `trip_id` (FK), `seat_id` (FK), `passengerName`, `passengerPhone`, `passengerEmail`, `bookingStatus` (`CONFIRMED`, `CANCELLED`, `MODIFIED`), `bookingDate`.
4. **`WaitingListEntry.java`**
   - Table: `waiting_list`
   - Fields: `id` (PK), `trip_id` (FK), `customer_id` (FK), `passengerName`, `passengerPhone`, `seatsRequested`, `status` (`WAITING`, `ALLOCATED`, `EXPIRED`, `CANCELLED`), `requestDate`.

### 3.2 Repositories (`@Repository`)
- `TripRepository.java`: `findByDepartureDateAndRoute(LocalDate date, Long routeId)`, `findActiveTrips()`
- `SeatRepository.java`: `findByTripIdOrderBySeatNumberAsc(Long tripId)`, `findByTripIdAndSeatNumber(Long tripId, String seatNumber)`
- `ReservationRepository.java`: `findByCustomerId(Long customerId)`, `findByBookingReference(String ref)`
- `WaitingListRepository.java`: `findByTripIdOrderByRequestDateAsc(Long tripId)`

### 3.3 Data Transfer Objects (`DTOs`)
- `TripDto.java`
- `SeatDto.java`
- `ReservationRequest.java` (Bean Validation: `@NotNull`, `@NotBlank`, `@Email`)
- `ReservationResponseDto.java`
- `WaitingListDto.java`

### 3.4 Service Implementation (`ReservationService.java`)
Key algorithmic logic implemented:
```java
// Thread-Safe Atomic Seat Locking
@Transactional
public ReservationResponseDto createReservation(ReservationRequest req) {
    Seat seat = seatRepository.findByTripIdAndSeatNumberForUpdate(req.getTripId(), req.getSeatNumber())
            .orElseThrow(() -> new ResourceNotFoundException("Seat not found"));

    if (seat.getStatus() != SeatStatus.AVAILABLE) {
        throw new ConflictException("Seat " + req.getSeatNumber() + " was just booked by another customer. Please choose a different seat!");
    }

    // Lock seat
    seat.setStatus(SeatStatus.BOOKED);
    seatRepository.save(seat);

    // Decrement available capacity
    Trip trip = seat.getTrip();
    trip.setAvailableSeats(trip.getAvailableSeats() - 1);
    tripRepository.save(trip);

    // Create reservation record with unique reference
    Reservation res = new Reservation();
    res.setBookingReference("LT-BK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
    ...
    return mapToDto(reservationRepository.save(res));
}
```

### 3.5 REST Controllers
- `TripController.java` (`/api/trips`)
- `ReservationController.java` (`/api/reservations`)
- `WaitingListController.java` (`/api/waiting-list`)

---

## 4. REST API Endpoint Reference

| HTTP Method | URL Path | Role Required | Description |
|:---:|:---|:---|:---|
| `GET` | `/api/trips` | Public | Search trip schedules with available seats |
| `GET` | `/api/trips/{id}` | Public | Get full 2x2 seat map status for a trip |
| `GET` | `/api/trips/{id}/alternatives` | Public | Get nearby alternative trips on the same corridor |
| `GET` | `/api/reservations` | Any Authenticated | View all reservations (or customer's own bookings) |
| `GET` | `/api/reservations/{id}` | Any Authenticated | Get reservation booking receipt |
| `POST` | `/api/reservations` | Any Authenticated | Atomically book seat(s) |
| `PUT` | `/api/reservations/{id}` | Any Authenticated | Modify passenger info or reassign seat |
| `DELETE` | `/api/reservations/{id}` | Any Authenticated | Cancel reservation and release seat back to inventory |
| `GET` | `/api/waiting-list` | Any Authenticated | View priority waiting list queue |
| `POST` | `/api/waiting-list` | Any Authenticated | Join waiting list for fully booked trip |
| `DELETE` | `/api/waiting-list/{id}` | Any Authenticated | Cancel waiting list request |

---

## 5. Sample JSON Payloads

### POST `/api/reservations` (Create Booking)
```json
{
  "tripId": 1,
  "seatNumber": "2A",
  "passengerName": "Kasun Silva",
  "passengerPhone": "0771234567",
  "passengerEmail": "kasun.silva@gmail.com"
}
```

### POST `/api/waiting-list` (Join Queue)
```json
{
  "tripId": 2,
  "passengerName": "Dilani Perera",
  "passengerPhone": "0714567890",
  "seatsRequested": 2
}
```

---

## 6. University Viva Examination Defense Guide

**Q1: How does your module handle concurrent bookings when two users select the same seat simultaneously?**  
*Answer:* The `createReservation()` method is annotated with `@Transactional`. Before allocating the seat, it queries the database and verifies `seat.getStatus() == AVAILABLE`. If two requests arrive concurrently, the first transaction locks and updates the seat status to `BOOKED`. The second transaction encounters the updated state and throws a `ConflictException` (`409 Conflict`), alerting the second user that the seat was just reserved and asking them to choose another.

**Q2: What happens in the database when a customer cancels their booking?**  
*Answer:* In `cancelReservation()`, two synchronized database updates take place:
1. The reservation entity's `bookingStatus` is updated to `CANCELLED`.
2. The associated `Seat` entity is released: its status is restored from `BOOKED` back to `AVAILABLE`, and the parent `Trip` entity's `availableSeats` count is incremented by 1.

**Q3: How does the waiting list feature work?**  
*Answer:* When all 40+ seats on a coach are sold out (`availableSeats == 0`), customers can join the waiting list. The entries are ordered by `requestDate` ascending to guarantee FIFO fairness. Additionally, the `/trips/{id}/alternatives` endpoint automatically locates other departures scheduled on the same route on the same date with available seats.
