package com.lankatransit.system.tripplanning;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DelayLogRepository extends JpaRepository<DelayLog, Long> {
    List<DelayLog> findByScheduleIdOrderByReportedAtDesc(Long scheduleId);
    List<DelayLog> findAllByOrderByReportedAtDesc();
}
