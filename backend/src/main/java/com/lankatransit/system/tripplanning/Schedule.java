package com.lankatransit.system.tripplanning;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "schedules")
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "schedule_code", nullable = false, unique = true, length = 30)
    private String scheduleCode;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bus_id", nullable = false)
    private Bus bus;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    @Column(name = "departure_time", nullable = false, length = 10)
    private String departureTime;

    @Column(name = "arrival_time", nullable = false, length = 10)
    private String arrivalTime;

    @Column(length = 30)
    private String frequency = "DAILY"; // DAILY, WEEKDAYS, WEEKENDS

    @Column(nullable = false, length = 30)
    private String status = "ACTIVE"; // ACTIVE, SUSPENDED, CANCELLED

    @Column(name = "effective_from")
    private LocalDate effectiveFrom;

    @Column(name = "effective_to")
    private LocalDate effectiveTo;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Schedule() {}

    public Schedule(String scheduleCode, Route route, Bus bus, Driver driver, String departureTime, String arrivalTime, String frequency, String status, LocalDate effectiveFrom, LocalDate effectiveTo) {
        this.scheduleCode = scheduleCode;
        this.route = route;
        this.bus = bus;
        this.driver = driver;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.frequency = frequency != null ? frequency : "DAILY";
        this.status = status != null ? status : "ACTIVE";
        this.effectiveFrom = effectiveFrom;
        this.effectiveTo = effectiveTo;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getScheduleCode() { return scheduleCode; }
    public void setScheduleCode(String scheduleCode) { this.scheduleCode = scheduleCode; }

    public Route getRoute() { return route; }
    public void setRoute(Route route) { this.route = route; }

    public Bus getBus() { return bus; }
    public void setBus(Bus bus) { this.bus = bus; }

    public Driver getDriver() { return driver; }
    public void setDriver(Driver driver) { this.driver = driver; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
