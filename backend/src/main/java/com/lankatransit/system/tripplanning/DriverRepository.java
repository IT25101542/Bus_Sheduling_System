package com.lankatransit.system.tripplanning;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    Optional<Driver> findByDriverCode(String driverCode);
    Optional<Driver> findByLicenseNumber(String licenseNumber);
    List<Driver> findByStatus(String status);
}
