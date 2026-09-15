# Member 2: Reservation Management & Seat Allocation
- **Student Name:** Jayakody J.A.K.Y
- **Student ID:** IT25101542
- **Module Code:** UC-02 / FR-02
- **Full Requirement Specification:** [`backend/requirements/FR2_Reservation_Management_Jayakody_IT25101542.md`](../../../requirements/FR2_Reservation_Management_Jayakody_IT25101542.md)

### Key Classes:
- Entities: `Trip.java`, `Seat.java`, `Reservation.java`, `WaitingListEntry.java`
- Service: `ReservationService.java` (Implements atomic seat locking, double-booking prevention, cancellation seat freeing, priority waiting list queue)
- Controllers: `TripController.java`, `ReservationController.java`, `WaitingListController.java`
