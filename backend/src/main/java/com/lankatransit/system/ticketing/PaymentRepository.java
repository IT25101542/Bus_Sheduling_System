package com.lankatransit.system.ticketing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByTransactionRef(String transactionRef);
    Optional<Payment> findByReservationId(Long reservationId);
    List<Payment> findAllByOrderByPaymentDateDesc();
}
