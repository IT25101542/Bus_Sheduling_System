package com.lankatransit.system.tripplanning;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class RouteDto {
    private Long id;

    @NotBlank(message = "Route number is required")
    private String routeNumber;

    @NotBlank(message = "Origin is required")
    private String origin;

    @NotBlank(message = "Destination is required")
    private String destination;

    @Min(value = 1, message = "Distance must be greater than 0")
    private double distanceKm;

    @Min(value = 1, message = "Estimated duration must be greater than 0")
    private int estimatedDurationMins;

    @Min(value = 0, message = "Base fare cannot be negative")
    private double baseFare;

    private boolean active = true;
    private List<String> stopNames;

    public RouteDto() {}

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

    public List<String> getStopNames() { return stopNames; }
    public void setStopNames(List<String> stopNames) { this.stopNames = stopNames; }
}
