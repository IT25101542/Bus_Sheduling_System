package com.lankatransit.system.eventtransport;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransportEventRepository extends JpaRepository<TransportEvent, Long> {
    List<TransportEvent> findByStatus(String status);
    List<TransportEvent> findAllByOrderByStartDateAsc();
}
