package com.lankatransit.system.tripplanning;

import jakarta.validation.constraints.NotBlank;

public class DriverDto {
    private Long id;

    @NotBlank(message = "Driver code is required")
    private String driverCode;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "License number is required")
    private String licenseNumber;

    @NotBlank(message = "Phone number is required")
    private String phone;

    private String status = "AVAILABLE";
    private String assignedDepot = "Colombo Fort Central Depot";

    public DriverDto() {}

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
}
