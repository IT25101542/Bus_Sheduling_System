package com.lankatransit.system.tripplanning;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "buses")
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bus_number", nullable = false, unique = true, length = 30)
    private String busNumber;

    @Column(name = "registration_number", nullable = false, unique = true, length = 30)
    private String registrationNumber;

    @Column(nullable = false)
    private int capacity = 40;

    @Column(name = "bus_type", nullable = false, length = 30)
    private String busType = "LUXURY_AC"; // LUXURY_AC, HIGHWAY_EXPRESS, SEMI_LUXURY, STANDARD

    @Column(nullable = false, length = 30)
    private String status = "ACTIVE"; // ACTIVE, MAINTENANCE, INACTIVE

    @Column(name = "depot_location", nullable = false, length = 80)
    private String depotLocation = "Colombo Fort Central Depot";

    @Column(name = "air_conditioned")
    private boolean airConditioned = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Bus() {}

    public Bus(String busNumber, String registrationNumber, int capacity, String busType, String status, String depotLocation, boolean airConditioned) {
        this.busNumber = busNumber;
        this.registrationNumber = registrationNumber;
        this.capacity = capacity;
        this.busType = busType;
        this.status = status;
        this.depotLocation = depotLocation;
        this.airConditioned = airConditioned;
        this.createdAt = LocalDateTime.now();
    }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
