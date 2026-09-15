package com.lankatransit.system.eventtransport;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventPassengerRepository extends JpaRepository<EventPassenger, Long> {
    List<EventPassenger> findByEventId(Long eventId);
    List<EventPassenger> findByEventTripId(Long eventTripId);
    long countByEventId(Long eventId);
    long countByEventIdAndCheckInStatusTrue(Long eventId);
}
