package com.lankatransit.system.eventtransport;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TransportEventDto {
    private Long id;

    @NotBlank(message = "Event name is required")
    private String eventName;

    private String eventType = "CORPORATE"; // CORPORATE, SPORTS, EXCURSION, PILGRIMAGE, WEDDING

    @NotBlank(message = "Organizer name is required")
    private String organizerName;

    @NotBlank(message = "Contact phone is required")
    private String contactPhone;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @NotBlank(message = "Origin is required")
    private String origin;

    @NotBlank(message = "Destination is required")
    private String destination;

    @Min(value = 1, message = "At least 1 bus is required")
    private int requiredBuses = 1;

    @Min(value = 1, message = "Required capacity must be at least 1")
    private int requiredCapacity = 40;

    private String status = "CONFIRMED";
    private LocalDateTime createdAt;
    private int assignedBusesCount;
    private int registeredPassengersCount;

    public TransportEventDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getOrganizerName() { return organizerName; }
    public void setOrganizerName(String organizerName) { this.organizerName = organizerName; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public int getRequiredBuses() { return requiredBuses; }
    public void setRequiredBuses(int requiredBuses) { this.requiredBuses = requiredBuses; }

    public int getRequiredCapacity() { return requiredCapacity; }
    public void setRequiredCapacity(int requiredCapacity) { this.requiredCapacity = requiredCapacity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public int getAssignedBusesCount() { return assignedBusesCount; }
    public void setAssignedBusesCount(int assignedBusesCount) { this.assignedBusesCount = assignedBusesCount; }

    public int getRegisteredPassengersCount() { return registeredPassengersCount; }
    public void setRegisteredPassengersCount(int registeredPassengersCount) { this.registeredPassengersCount = registeredPassengersCount; }
}
