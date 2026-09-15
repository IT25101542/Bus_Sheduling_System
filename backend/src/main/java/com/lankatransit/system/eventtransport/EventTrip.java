package com.lankatransit.system.eventtransport;

import com.lankatransit.system.tripplanning.Bus;
import com.lankatransit.system.tripplanning.Driver;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "event_trips")
public class EventTrip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "event_id", nullable = false)
    private TransportEvent event;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "bus_id", nullable = false)
    private Bus bus;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    @Column(name = "trip_date", nullable = false)
    private LocalDate tripDate;

    @Column(name = "departure_time", nullable = false, length = 10)
    private String departureTime;

    @Column(name = "return_time", length = 10)
    private String returnTime;

    @Column(nullable = false, length = 30)
    private String status = "SCHEDULED"; // SCHEDULED, ACTIVE, COMPLETED, CANCELLED

    public EventTrip() {}

    public EventTrip(TransportEvent event, Bus bus, Driver driver, LocalDate tripDate, String departureTime, String returnTime) {
        this.event = event;
        this.bus = bus;
        this.driver = driver;
        this.tripDate = tripDate;
        this.departureTime = departureTime;
        this.returnTime = returnTime;
        this.status = "SCHEDULED";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public TransportEvent getEvent() { return event; }
    public void setEvent(TransportEvent event) { this.event = event; }

    public Bus getBus() { return bus; }
    public void setBus(Bus bus) { this.bus = bus; }

    public Driver getDriver() { return driver; }
    public void setDriver(Driver driver) { this.driver = driver; }

    public LocalDate getTripDate() { return tripDate; }
    public void setTripDate(LocalDate tripDate) { this.tripDate = tripDate; }

    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }

    public String getReturnTime() { return returnTime; }
    public void setReturnTime(String returnTime) { this.returnTime = returnTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
