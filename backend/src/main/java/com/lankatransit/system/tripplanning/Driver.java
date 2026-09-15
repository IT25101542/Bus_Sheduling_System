package com.lankatransit.system.tripplanning;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "drivers")
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "driver_code", nullable = false, unique = true, length = 30)
    private String driverCode;

    @Column(name = "full_name", nullable = false, length = 120)
    private String fullName;

    @Column(name = "license_number", nullable = false, unique = true, length = 40)
    private String licenseNumber;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(nullable = false, length = 30)
    private String status = "AVAILABLE"; // AVAILABLE, ON_TRIP, ON_LEAVE

    @Column(name = "assigned_depot", nullable = false, length = 80)
    private String assignedDepot = "Colombo Fort Central Depot";

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Driver() {}

    public Driver(String driverCode, String fullName, String licenseNumber, String phone, String status, String assignedDepot) {
        this.driverCode = driverCode;
        this.fullName = fullName;
        this.licenseNumber = licenseNumber;
        this.phone = phone;
        this.status = status;
        this.assignedDepot = assignedDepot;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDriverCode() { return driverCode; }
    public void setDriverCode(String driverCode) { this.driverCode = driverCode; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAssignedDepot() { return assignedDepot; }
    public void setAssignedDepot(String assignedDepot) { this.assignedDepot = assignedDepot; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
