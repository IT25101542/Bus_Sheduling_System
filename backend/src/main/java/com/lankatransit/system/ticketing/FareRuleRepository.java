package com.lankatransit.system.ticketing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FareRuleRepository extends JpaRepository<FareRule, Long> {
    List<FareRule> findByActiveTrue();
    List<FareRule> findByRouteId(Long routeId);
    Optional<FareRule> findByRouteIdAndPassengerType(Long routeId, String passengerType);
}
