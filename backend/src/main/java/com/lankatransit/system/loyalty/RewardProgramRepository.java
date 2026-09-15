package com.lankatransit.system.loyalty;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RewardProgramRepository extends JpaRepository<RewardProgram, Long> {
    List<RewardProgram> findByActiveTrue();
    Optional<RewardProgram> findByProgramName(String programName);
}
