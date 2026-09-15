package com.lankatransit.system.reservation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    Optional<Trip> findByTripCode(String tripCode);
    List<Trip> findByTripDate(LocalDate tripDate);
    List<Trip> findByRouteOriginContainingIgnoreCaseAndRouteDestinationContainingIgnoreCaseAndTripDate(String origin, String destination, LocalDate tripDate);
    List<Trip> findByRouteIdAndTripDate(Long routeId, LocalDate tripDate);
    List<Trip> findByRouteId(Long routeId);
}
