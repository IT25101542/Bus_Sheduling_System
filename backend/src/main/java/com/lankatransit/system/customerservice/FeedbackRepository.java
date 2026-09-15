package com.lankatransit.system.customerservice;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByTripIdOrderByCreatedAtDesc(Long tripId);
    List<Feedback> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<Feedback> findAllByOrderByCreatedAtDesc();
}
