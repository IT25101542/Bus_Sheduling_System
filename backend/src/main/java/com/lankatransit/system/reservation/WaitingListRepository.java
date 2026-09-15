package com.lankatransit.system.reservation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WaitingListRepository extends JpaRepository<WaitingListEntry, Long> {
    List<WaitingListEntry> findByTripIdOrderByCreatedAtAsc(Long tripId);
    List<WaitingListEntry> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
}
