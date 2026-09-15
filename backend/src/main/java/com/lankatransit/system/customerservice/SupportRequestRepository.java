package com.lankatransit.system.customerservice;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupportRequestRepository extends JpaRepository<SupportRequest, Long> {
    Optional<SupportRequest> findByRequestCode(String requestCode);
    List<SupportRequest> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<SupportRequest> findAllByOrderByCreatedAtDesc();
}
