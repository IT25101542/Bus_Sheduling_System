package com.lankatransit.system.eventtransport;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventTripRepository extends JpaRepository<EventTrip, Long> {
    List<EventTrip> findByEventId(Long eventId);
    List<EventTrip> findByBusIdAndTripDate(Long busId, LocalDate tripDate);
}
