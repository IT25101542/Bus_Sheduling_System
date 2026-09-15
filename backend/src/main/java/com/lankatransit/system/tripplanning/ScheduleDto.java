package com.lankatransit.system.tripplanning;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class ScheduleDto {
    private Long id;

    @NotBlank(message = "Schedule code is required")
    private String scheduleCode;

    @NotNull(message = "Route ID is required")
    private Long routeId;

    @NotNull(message = "Bus ID is required")
    private Long busId;

    @NotNull(message = "Driver ID is required")
    private Long driverId;

    @NotBlank(message = "Departure time is required")
    private String departureTime;

    @NotBlank(message = "Arrival time is required")
    private String arrivalTime;

    private String frequency = "DAILY";
    private String status = "ACTIVE";
    private LocalDate effectiveFrom;
    private LocalDate effectiveTo;

    // Display fields
    private String routeName;
    private String busNumber;
    private String driverName;

    public ScheduleDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getScheduleCode() { return scheduleCode; }
    public void setScheduleCode(String scheduleCode) { this.scheduleCode = scheduleCode; }

    public Long getRouteId() { return routeId; }
    public void setRouteId(Long routeId) { this.routeId = routeId; }

    public Long getBusId() { return busId; }
    public void setBusId(Long busId) { this.busId = busId; }

    public Long getDriverId() { return driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }

    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }

    public String getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getEffectiveFrom() { return effectiveFrom; }
    public void setEffectiveFrom(LocalDate effectiveFrom) { this.effectiveFrom = effectiveFrom; }

    public LocalDate getEffectiveTo() { return effectiveTo; }
    public void setEffectiveTo(LocalDate effectiveTo) { this.effectiveTo = effectiveTo; }

    public String getRouteName() { return routeName; }
    public void setRouteName(String routeName) { this.routeName = routeName; }

    public String getBusNumber() { return busNumber; }
    public void setBusNumber(String busNumber) { this.busNumber = busNumber; }

    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }
}
