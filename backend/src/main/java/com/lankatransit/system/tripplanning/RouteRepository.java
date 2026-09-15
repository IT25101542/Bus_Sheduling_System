package com.lankatransit.system.tripplanning;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    Optional<Route> findByRouteNumber(String routeNumber);
    List<Route> findByActiveTrue();
    List<Route> findByOriginContainingIgnoreCaseAndDestinationContainingIgnoreCase(String origin, String destination);
}
