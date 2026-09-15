package com.lankatransit.system.eventtransport;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "transport_events")
public class TransportEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_name", nullable = false, length = 120)
    private String eventName;

    @Column(name = "event_type", nullable = false, length = 50)
    private String eventType = "CORPORATE"; // CORPORATE, SPORTS, EXCURSION, PILGRIMAGE, WEDDING

    @Column(name = "organizer_name", nullable = false, length = 120)
    private String organizerName;

    @Column(name = "contact_phone", nullable = false, length = 20)
    private String contactPhone;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(nullable = false, length = 80)
    private String origin;

    @Column(nullable = false, length = 80)
    private String destination;

    @Column(name = "required_buses", nullable = false)
    private int requiredBuses = 1;

    @Column(name = "required_capacity", nullable = false)
    private int requiredCapacity = 40;

    @Column(nullable = false, length = 30)
    private String status = "CONFIRMED"; // REQUESTED, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public TransportEvent() {}

    public TransportEvent(String eventName, String eventType, String organizerName, String contactPhone, LocalDate startDate, LocalDate endDate, String origin, String destination, int requiredBuses, int requiredCapacity) {
        this.eventName = eventName;
        this.eventType = eventType;
        this.organizerName = organizerName;
        this.contactPhone = contactPhone;
        this.startDate = startDate;
        this.endDate = endDate;
        this.origin = origin;
        this.destination = destination;
        this.requiredBuses = requiredBuses;
        this.requiredCapacity = requiredCapacity;
        this.status = "CONFIRMED";
        this.createdAt = LocalDateTime.now();
    }

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
}
