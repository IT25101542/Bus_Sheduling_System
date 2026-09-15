# Lanka Transit Services (Pvt) Ltd
## Backend Functional Requirements Specification Index
**Academic Year:** 2026  
**Module:** Software Engineering Group Project (6 Members)  
**Client:** Lanka Transit Services (Pvt) Ltd  

---

### Index of Individual Functional Requirement Documents

Each group member has their own dedicated backend functional requirement specification document detailed with architecture, entities, repository queries, service logic, API endpoints, JSON payloads, and university viva defense questions:

| Document Link | Member Name | Student ID | Module Code | Functional Domain |
|:---|:---|:---:|:---:|:---|
| [**FR-01: Trip Planning & Scheduling**](file:///e:/SLIIT/Software%20E/Group%20project%2002/backend/requirements/FR1_Trip_Planning_Scheduling_Abeysinghe_IT25100270.md) | **Abeysinghe H.I.A** | `IT25100270` | `UC-01` | Bus Fleet, Drivers, Routes, Stops, Schedules, Delay Tracking, Conflict Detection Engine |
| [**FR-02: Reservation Management**](file:///e:/SLIIT/Software%20E/Group%20project%2002/backend/requirements/FR2_Reservation_Management_Jayakody_IT25101542.md) | **Jayakody J.A.K.Y** | `IT25101542` | `UC-02` | Trip Search, 2x2 Interactive Seat Map, Atomic Seat Locking, Cancellation/Modification, Priority Waiting List |
| [**FR-03: Ticketing & Fare Management**](file:///e:/SLIIT/Software%20E/Group%20project%2002/backend/requirements/FR3_Ticketing_Fare_Management_Perera_IT25103360.md) | **Perera M.G.K** | `IT25103360` | `UC-03` | Dynamic Fare Formulas, Concessions, E-Tickets with QR Codes, Payments Audit, Tiered Refunds, Revenue Analytics |
| [**FR-04: Loyalty Rewards Management**](file:///e:/SLIIT/Software%20E/Group%20project%2002/backend/requirements/FR4_Loyalty_Rewards_Berugoda_IT25103022.md) | **Berugoda B.A.N.R** | `IT25103022` | `UC-04` | Membership Tiers (Bronze/Silver/Gold/Platinum), Points Multipliers, Voucher Store, Balance Check, Audit Ledger |
| [**FR-05: Customer Service Management**](file:///e:/SLIIT/Software%20E/Group%20project%2002/backend/requirements/FR5_Customer_Service_Nimjaya_IT25102352.md) | **Nimjaya G.S.** | `IT25102352` | `UC-05` | Grievance Tracker (`OPEN`&rarr;`IN_PROGRESS`&rarr;`RESOLVED`&rarr;`CLOSED`), Support Inquiries, 5-Star Reviews, Notification Alerts |
| [**FR-06: Special Event Transport**](file:///e:/SLIIT/Software%20E/Group%20project%2002/backend/requirements/FR6_Event_Transport_Ilakkiya_IT25101077.md) | **Ilakkiya. S** | `IT25101077` | `UC-06` | Bulk Event Charters, Dedicated Fleet Dispatch, Availability Conflict Checks, Manifests, 1-Click Gate Check-in |

---

### Backend Source Directory Cross-Reference

```
backend/src/main/java/com/lankatransit/system/
├── tripplanning/       -> Member 1 (IT25100270): FR1_Trip_Planning_Scheduling_Abeysinghe_IT25100270.md
├── reservation/        -> Member 2 (IT25101542): FR2_Reservation_Management_Jayakody_IT25101542.md
├── ticketing/          -> Member 3 (IT25103360): FR3_Ticketing_Fare_Management_Perera_IT25103360.md
├── loyalty/            -> Member 4 (IT25103022): FR4_Loyalty_Rewards_Berugoda_IT25103022.md
├── customerservice/    -> Member 5 (IT25102352): FR5_Customer_Service_Nimjaya_IT25102352.md
├── eventtransport/     -> Member 6 (IT25101077): FR6_Event_Transport_Ilakkiya_IT25101077.md
├── auth/               -> Shared JWT Authentication & Customer Management
├── common/             -> Shared ApiResponse & Role Enum
└── config/             -> SecurityConfig, CorsConfig, DataInitializer
```
