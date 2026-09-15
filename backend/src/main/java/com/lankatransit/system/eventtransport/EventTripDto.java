package com.lankatransit.system.eventtransport;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class EventTripDto {
    private Long id;

    @NotNull(message = "Event ID is required")
    private Long eventId;

    @NotNull(message = "Bus ID is required")
    private Long busId;

    @NotNull(message = "Driver ID is required")
    private Long driverId;

    @NotNull(message = "Trip date is required")
    private LocalDate tripDate;

    @NotBlank(message = "Departure time is required")
    private String departureTime;

    private String returnTime;
    private String status = "SCHEDULED";

    private String busNumber;
    private String busType;
    private int busCapacity;
    private String driverName;

    public EventTripDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }

    public Long getBusId() { return busId; }
    public void setBusId(Long busId) { this.busId = busId; }

    public Long getDriverId() { return driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }

    public LocalDate getTripDate() { return tripDate; }
    public void setTripDate(LocalDate tripDate) { this.tripDate = tripDate; }

    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }

    public String getReturnTime() { return returnTime; }
    public void setReturnTime(String returnTime) { this.returnTime = returnTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getBusNumber() { return busNumber; }
    public void setBusNumber(String busNumber) { this.busNumber = busNumber; }

    public String getBusType() { return busType; }
    public void setBusType(String busType) { this.busType = busType; }

    public int getBusCapacity() { return busCapacity; }
    public void setBusCapacity(int busCapacity) { this.busCapacity = busCapacity; }

    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }
}
