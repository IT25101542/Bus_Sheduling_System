package com.lankatransit.system.tripplanning;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class BusDto {
    private Long id;

    @NotBlank(message = "Bus number is required")
    private String busNumber;

    @NotBlank(message = "Registration number is required")
    private String registrationNumber;

    @Min(value = 10, message = "Capacity must be at least 10 seats")
    private int capacity = 40;

    private String busType = "LUXURY_AC";
    private String status = "ACTIVE";
    private String depotLocation = "Colombo Fort Central Depot";
    private boolean airConditioned = true;

    public BusDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBusNumber() { return busNumber; }
    public void setBusNumber(String busNumber) { this.busNumber = busNumber; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public String getBusType() { return busType; }
    public void setBusType(String busType) { this.busType = busType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDepotLocation() { return depotLocation; }
    public void setDepotLocation(String depotLocation) { this.depotLocation = depotLocation; }

    public boolean isAirConditioned() { return airConditioned; }
    public void setAirConditioned(boolean airConditioned) { this.airConditioned = airConditioned; }
}
