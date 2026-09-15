package com.lankatransit.system.customerservice;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    Optional<Complaint> findByComplaintCode(String complaintCode);
    List<Complaint> findByCustomerIdOrderBySubmittedAtDesc(Long customerId);
    List<Complaint> findByStatus(String status);
    List<Complaint> findAllByOrderBySubmittedAtDesc();
}
