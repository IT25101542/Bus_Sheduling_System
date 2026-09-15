package com.lankatransit.system.reservation;

import com.lankatransit.system.tripplanning.Bus;
import com.lankatransit.system.tripplanning.Driver;
import com.lankatransit.system.tripplanning.Route;
import com.lankatransit.system.tripplanning.Schedule;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "trips")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trip_code", nullable = false, unique = true, length = 40)
    private String tripCode;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "schedule_id", nullable = false)
    private Schedule schedule;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;

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

    @Column(name = "arrival_time", nullable = false, length = 10)
    private String arrivalTime;

    @Column(name = "fare_amount", nullable = false)
    private double fareAmount;

    @Column(name = "total_seats", nullable = false)
    private int totalSeats = 40;

    @Column(name = "available_seats", nullable = false)
    private int availableSeats = 40;

    @Column(nullable = false, length = 30)
    private String status = "SCHEDULED"; // SCHEDULED, BOARDING, IN_TRANSIT, COMPLETED, CANCELLED

    public Trip() {}

    public Trip(String tripCode, Schedule schedule, Route route, Bus bus, Driver driver, LocalDate tripDate, String departureTime, String arrivalTime, double fareAmount, int totalSeats) {
        this.tripCode = tripCode;
        this.schedule = schedule;
        this.route = route;
        this.bus = bus;
        this.driver = driver;
        this.tripDate = tripDate;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.fareAmount = fareAmount;
        this.totalSeats = totalSeats;
        this.availableSeats = totalSeats;
        this.status = "SCHEDULED";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTripCode() { return tripCode; }
    public void setTripCode(String tripCode) { this.tripCode = tripCode; }

    public Schedule getSchedule() { return schedule; }
    public void setSchedule(Schedule schedule) { this.schedule = schedule; }

    public Route getRoute() { return route; }
    public void setRoute(Route route) { this.route = route; }

    public Bus getBus() { return bus; }
    public void setBus(Bus bus) { this.bus = bus; }

    public Driver getDriver() { return driver; }
    public void setDriver(Driver driver) { this.driver = driver; }

    public LocalDate getTripDate() { return tripDate; }
    public void setTripDate(LocalDate tripDate) { this.tripDate = tripDate; }

    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }

    public String getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }

    public double getFareAmount() { return fareAmount; }
    public void setFareAmount(double fareAmount) { this.fareAmount = fareAmount; }

    public int getTotalSeats() { return totalSeats; }
    public void setTotalSeats(int totalSeats) { this.totalSeats = totalSeats; }

    public int getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(int availableSeats) { this.availableSeats = availableSeats; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
