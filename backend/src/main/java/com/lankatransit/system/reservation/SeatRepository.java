package com.lankatransit.system.reservation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByTripIdOrderBySeatNumberAsc(Long tripId);
    Optional<Seat> findByTripIdAndSeatNumber(Long tripId, String seatNumber);
    long countByTripIdAndSeatStatus(Long tripId, String seatStatus);
}
