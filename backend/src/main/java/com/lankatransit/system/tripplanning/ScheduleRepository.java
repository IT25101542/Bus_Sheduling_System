package com.lankatransit.system.tripplanning;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    Optional<Schedule> findByScheduleCode(String scheduleCode);
    List<Schedule> findByRouteId(Long routeId);
    List<Schedule> findByBusId(Long busId);
    List<Schedule> findByDriverId(Long driverId);
    List<Schedule> findByStatus(String status);
}
