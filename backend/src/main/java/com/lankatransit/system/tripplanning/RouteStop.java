package com.lankatransit.system.tripplanning;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "route_stops")
public class RouteStop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    @JsonBackReference
    private Route route;

    @Column(name = "stop_name", nullable = false, length = 80)
    private String stopName;

    @Column(name = "stop_order", nullable = false)
    private int stopOrder;

    @Column(name = "distance_from_origin_km", nullable = false)
    private double distanceFromOriginKm;

    public RouteStop() {}

    public RouteStop(Route route, String stopName, int stopOrder, double distanceFromOriginKm) {
        this.route = route;
        this.stopName = stopName;
        this.stopOrder = stopOrder;
        this.distanceFromOriginKm = distanceFromOriginKm;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Route getRoute() { return route; }
    public void setRoute(Route route) { this.route = route; }

    public String getStopName() { return stopName; }
    public void setStopName(String stopName) { this.stopName = stopName; }

    public int getStopOrder() { return stopOrder; }
    public void setStopOrder(int stopOrder) { this.stopOrder = stopOrder; }

    public double getDistanceFromOriginKm() { return distanceFromOriginKm; }
    public void setDistanceFromOriginKm(double distanceFromOriginKm) { this.distanceFromOriginKm = distanceFromOriginKm; }
}
