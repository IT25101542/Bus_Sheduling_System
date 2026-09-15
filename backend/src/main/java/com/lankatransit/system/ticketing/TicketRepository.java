package com.lankatransit.system.ticketing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Optional<Ticket> findByTicketNumber(String ticketNumber);
    Optional<Ticket> findByReservationId(Long reservationId);
    List<Ticket> findByCustomerIdOrderByIssueDateDesc(Long customerId);
    List<Ticket> findByTripId(Long tripId);
}
