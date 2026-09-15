package com.lankatransit.system.tripplanning;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "routes")
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "route_number", nullable = false, unique = true, length = 30)
    private String routeNumber;

    @Column(nullable = false, length = 80)
    private String origin;

    @Column(nullable = false, length = 80)
    private String destination;

    @Column(name = "distance_km", nullable = false)
    private double distanceKm;

    @Column(name = "estimated_duration_mins", nullable = false)
    private int estimatedDurationMins;

    @Column(name = "base_fare", nullable = false)
    private double baseFare;

    @Column(name = "is_active")
    private boolean active = true;

    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<RouteStop> stops = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Route() {}

    public Route(String routeNumber, String origin, String destination, double distanceKm, int estimatedDurationMins, double baseFare) {
        this.routeNumber = routeNumber;
        this.origin = origin;
        this.destination = destination;
        this.distanceKm = distanceKm;
        this.estimatedDurationMins = estimatedDurationMins;
        this.baseFare = baseFare;
        this.active = true;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRouteNumber() { return routeNumber; }
    public void setRouteNumber(String routeNumber) { this.routeNumber = routeNumber; }

    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(double distanceKm) { this.distanceKm = distanceKm; }

    public int getEstimatedDurationMins() { return estimatedDurationMins; }
    public void setEstimatedDurationMins(int estimatedDurationMins) { this.estimatedDurationMins = estimatedDurationMins; }

    public double getBaseFare() { return baseFare; }
    public void setBaseFare(double baseFare) { this.baseFare = baseFare; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public List<RouteStop> getStops() { return stops; }
    public void setStops(List<RouteStop> stops) { this.stops = stops; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
