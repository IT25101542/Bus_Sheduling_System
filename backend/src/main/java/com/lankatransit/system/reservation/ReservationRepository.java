package com.lankatransit.system.reservation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Optional<Reservation> findByBookingReference(String bookingReference);
    List<Reservation> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<Reservation> findByTripId(Long tripId);
    boolean existsByTripIdAndSeatNumberAndReservationStatus(Long tripId, String seatNumber, String status);
}
