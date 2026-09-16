package com.lankatransit.system.loyalty;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RewardAccountRepository extends JpaRepository<RewardAccount, Long> {
    Optional<RewardAccount> findByCustomerId(Long customerId);
}
