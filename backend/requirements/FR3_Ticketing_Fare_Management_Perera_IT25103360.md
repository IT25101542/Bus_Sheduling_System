# University Software Engineering Group Project — Individual Functional Requirement Specification

# FUNCTIONAL REQUIREMENT 03 (FR-03 / UC-03)
## Ticketing & Fare Management

---

### Student Attribution & Academic Details
- **Assigned Group Member:** Perera M.G.K
- **Student Registration Number:** IT25103360
- **Academic Degree:** BSc (Hons) in Information Technology / Software Engineering
- **Institution:** Sri Lanka Institute of Information Technology (SLIIT)
- **Module Name:** Software Engineering Project (Year 2 / Year 3)
- **Client Organization:** Lanka Transit Services (Pvt) Ltd

---

## 1. Requirement Scope & Business Objectives

### 1.1 Objective
The Ticketing & Fare Management module provides complete financial control and digital ticketing operations for Lanka Transit Services. It encompasses a dynamic distance- and class-based fare calculation engine with passenger category concessions (Child, Student, Senior), electronic ticket (E-Ticket) generation with scannable cryptographic QR verification codes, payment settlement auditing (Credit/Debit Card, Counter Cash), tiered refund claim processing according to cancellation timing, and live financial revenue analytics.

### 1.2 Primary & Secondary Actors
- **Finance Administrator (Primary):** Manages fare rule tariffs, audits payment ledgers, authorizes customer refunds, and reviews corridor revenues.
- **Passenger (Primary):** Views transparent price breakdowns, completes mock fare settlements, and downloads official printable E-Tickets with QR codes.
- **Ticket Agent / Conductor (Secondary):** Verifies digital boarding passes at the depot or coach entrance using QR tokens.
- **General Manager (Secondary):** Monitors daily gross revenue, net margin, and refund volume.

---

## 2. Detailed Functional Requirements (FR Specifications)

| Requirement ID | Feature / Use Case | Description | Business Rules & Constraints |
|:---|:---|:---|:---|
| **FR-3.1** | **Dynamic Fare Rules Engine** | Configure base fares, per-kilometer tariffs, and category discounts for routes and bus comfort tiers. | Formula: `Total = (BasePrice + [PerKmRate * RouteDistance] * ClassMultiplier) * (1 - Discount%)`. |
| **FR-3.2** | **Live Fare Calculator Simulator** | Simulate ticket price given Route, Bus Type (SUPER_LUXURY 1.5x, LUXURY_AC 1.2x, SEMI_LUXURY 1.0x, NORMAL 0.8x), and Passenger Category (Child 50% off, Student 20% off, Senior 15% off). | Calculation runs dynamically on backend endpoint `/fares/calculate`. |
| **FR-3.3** | **Electronic Ticket (E-Ticket) Issuance** | Automatically issue an official digital ticket upon verified reservation and payment settlement. | Generates unique `ticketNumber` (e.g. `TK-2026-XXXXX`) and cryptographic QR verification hash. |
| **FR-3.4** | **Payment Settlement Audit Ledger** | Record transactions (Credit Card, Debit Card, Counter Cash, LankaQR) with receipt generation. | Records `transactionRef`, timestamp, amount settled, and booking reference. |
| **FR-3.5** | **Tiered Refund Processing** | Process passenger refund claims upon trip cancellation with automated policy deduction. | Policy brackets: > 24h prior (90% refund), > 6h prior (75% refund), < 6h prior (50% refund), Company Service Disruption (100% full refund). |
| **FR-3.6** | **Financial & Revenue Analytics** | Compute Gross Revenue, Total Refunds Issued, Net Margin, and High-Demand Corridor sales. | Aggregated real-time metrics available via `/payments/reports/financial`. |

---

## 3. Backend Package Architecture & Source Code Mapping

All source code files for Member 3 reside in:
📂 `backend/src/main/java/com/lankatransit/system/ticketing/`

### 3.1 Entities (`@Entity`)
1. **`FareRule.java`**
   - Table: `fare_rules`
   - Fields: `id` (PK), `ruleName`, `route_id` (FK nullable for global default), `passengerType` (`ADULT`, `CHILD`, `STUDENT`, `SENIOR`), `busType` (`SUPER_LUXURY`, `LUXURY_AC`, `SEMI_LUXURY`, `NORMAL`), `basePrice`, `perKmRate`, `discountPercentage`, `active`.
2. **`Ticket.java`**
   - Table: `tickets`
   - Fields: `id` (PK), `ticketNumber` (Unique), `reservation_id` (FK), `qrCode` (Verification hash), `fareAmount`, `issueDate`, `status` (`ISSUED`, `BOARDED`, `CANCELLED`, `REFUNDED`).
   - Relationships: `@OneToOne` with `Reservation`.
3. **`Payment.java`**
   - Table: `payments`
   - Fields: `id` (PK), `transactionRef` (Unique), `reservation_id` (FK), `ticket_id` (FK), `amount`, `paymentMethod` (`CREDIT_CARD`, `DEBIT_CARD`, `CASH`, `ONLINE_TRANSFER`), `paymentStatus` (`COMPLETED`, `FAILED`), `paymentDate`, `receiptNumber`.
4. **`Refund.java`**
   - Table: `refunds`
   - Fields: `id` (PK), `refundRef` (Unique), `ticket_id` (FK), `reservation_id` (FK), `refundAmount`, `reason`, `status` (`PROCESSED`), `processedAt`.

### 3.2 Repositories (`@Repository`)
- `FareRuleRepository.java`: `findByRouteIdAndPassengerType(Long routeId, String type)`, `findByActiveTrue()`
- `TicketRepository.java`: `findByTicketNumber(String ticketNumber)`, `findByReservationId(Long resId)`
- `PaymentRepository.java`: `findByReservationId(Long resId)`, `sumTotalCompletedRevenue()`
- `RefundRepository.java`: `sumTotalRefunds()`

### 3.3 Data Transfer Objects (`DTOs`)
- `FareRuleDto.java` (Bean Validation: `@NotBlank`, `@Min(0)`)
- `TicketDto.java`
- `PaymentDto.java` (Bean Validation: `@NotNull`, `@Min(0)`)
- `RefundDto.java` (Bean Validation: `@NotNull`, `@NotBlank`)

### 3.4 Service Implementation (`TicketingService.java`)
Key algorithmic logic implemented:
```java
// Mathematical Fare Calculation Formula
public double calculateFare(Long routeId, String passengerType, String busType) {
    Route route = routeRepository.findById(routeId)
            .orElseThrow(() -> new ResourceNotFoundException("Route not found"));

    FareRule rule = fareRuleRepository.findMatchingRule(routeId, passengerType, busType)
            .orElseGet(this::getDefaultGlobalFareRule);

    double classMultiplier = switch (busType) {
        case "SUPER_LUXURY" -> 1.5;
        case "LUXURY_AC" -> 1.2;
        case "SEMI_LUXURY" -> 1.0;
        default -> 0.8;
    };

    double grossFare = (rule.getBasePrice() + (rule.getPerKmRate() * route.getDistanceKm())) * classMultiplier;
    double netFare = grossFare * (1.0 - (rule.getDiscountPercentage() / 100.0));
    return Math.round(netFare * 100.0) / 100.0;
}

// Scannable Cryptographic QR Token Generation
public TicketDto issueTicket(Long reservationId) {
    ...
    String qrData = "LT|" + ticket.getTicketNumber() + "|" + reservation.getBookingReference()
            + "|" + ticket.getFareAmount() + "|" + UUID.randomUUID().toString().substring(0, 8);
    ticket.setQrCode(qrData);
    return mapToDto(ticketRepository.save(ticket));
}
```

### 3.5 REST Controllers
- `FareController.java` (`/api/fares`)
- `TicketController.java` (`/api/tickets`)
- `PaymentController.java` (`/api/payments`)
- `RefundController.java` (`/api/refunds`)

---

## 4. REST API Endpoint Reference

| HTTP Method | URL Path | Role Required | Description |
|:---:|:---|:---|:---|
| `GET` | `/api/fares` | Any Authenticated | Retrieve all fare configuration rules |
| `GET` | `/api/fares/calculate` | Public | Live calculate ticket fare given route and class |
| `POST` | `/api/fares` | `FINANCE_ADMIN`, `SYSTEM_ADMIN` | Create new tariff rule |
| `PUT` | `/api/fares/{id}` | `FINANCE_ADMIN`, `SYSTEM_ADMIN` | Update tariff parameters |
| `GET` | `/api/tickets` | Any Authenticated | View all tickets (or customer's e-tickets) |
| `GET` | `/api/tickets/{id}` | Any Authenticated | Get printable e-ticket with QR code |
| `POST` | `/api/tickets/generate/{resId}` | Any Authenticated | Issue digital e-ticket from reservation |
| `GET` | `/api/payments` | `FINANCE_ADMIN`, `SYSTEM_ADMIN` | View audit trail of all transactions |
| `POST` | `/api/payments` | Any Authenticated | Process mock card or cash settlement |
| `GET` | `/api/payments/reports/financial` | `FINANCE_ADMIN`, `SYSTEM_ADMIN` | Gross revenue, refund total, and net margin |
| `GET` | `/api/refunds` | `FINANCE_ADMIN`, `SYSTEM_ADMIN` | List all processed refund claims |
| `POST` | `/api/refunds` | `FINANCE_ADMIN`, `SYSTEM_ADMIN` | Authorize and execute ticket refund |

---

## 5. Sample JSON Payloads

### POST `/api/fares` (Create Fare Rule)
```json
{
  "ruleName": "Expressway Luxury AC Standard Adult",
  "routeId": 1,
  "passengerType": "ADULT",
  "busType": "LUXURY_AC",
  "basePrice": 450.0,
  "perKmRate": 14.5,
  "discountPercentage": 0.0,
  "active": true
}
```

### POST `/api/refunds` (Process Refund Claim)
```json
{
  "ticketId": 1,
  "reason": "Passenger cancelled 28 hours before departure (90% standard refund policy)"
}
```

---

## 6. University Viva Examination Defense Guide

**Q1: Explain how dynamic fare pricing is calculated in your backend.**  
*Answer:* In `TicketingService.java`, the system retrieves the `Route` to obtain the precise `distanceKm`. It then retrieves the relevant `FareRule` matching the passenger type (Adult, Student, etc.) and bus comfort class (Super Luxury, Luxury AC, etc.). The gross fare is calculated by adding the base price to the distance rate multiplied by the bus class tier factor. Finally, any applicable student or promotional discount percentage is subtracted to compute the final net fare rounded to two decimal places.

**Q2: How is the electronic ticket verified at the bus terminal or coach gate?**  
*Answer:* When an E-Ticket is issued, the service generates a unique ticket number and a cryptographic verification hash embedded in the `qrCode` field. At the bus gate, the conductor scans this QR code, which resolves the token against the backend `/api/tickets` registry to confirm validity, passenger identity, and boarding status (`ISSUED` &rarr; `BOARDED`).

**Q3: How do you prevent financial discrepancy when a ticket is refunded?**  
*Answer:* The `processRefund()` method executes within a `@Transactional` boundary. It marks the `Ticket` status as `REFUNDED`, creates an immutable `Refund` ledger entry referencing the original transaction, and updates the financial summary. The net revenue formula dynamically accounts for both positive inflows (`SUM(payments.amount)`) and negative disbursements (`SUM(refunds.refundAmount)`).
