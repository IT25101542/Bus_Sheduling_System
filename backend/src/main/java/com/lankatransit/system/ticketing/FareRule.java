package com.lankatransit.system.ticketing;

import com.lankatransit.system.tripplanning.Route;
import jakarta.persistence.*;

@Entity
@Table(name = "fare_rules")
public class FareRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "rule_name", nullable = false, length = 100)
    private String ruleName;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "route_id")
    private Route route;

    @Column(name = "passenger_type", nullable = false, length = 30)
    private String passengerType = "ADULT"; // ADULT, CHILD, STUDENT, SENIOR

    @Column(name = "bus_type", nullable = false, length = 30)
    private String busType = "LUXURY_AC";

    @Column(name = "base_price", nullable = false)
    private double basePrice;

    @Column(name = "per_km_rate", nullable = false)
    private double perKmRate;

    @Column(name = "discount_percentage")
    private double discountPercentage = 0.0;

    @Column(name = "is_active")
    private boolean active = true;

    public FareRule() {}

    public FareRule(String ruleName, Route route, String passengerType, String busType, double basePrice, double perKmRate, double discountPercentage, boolean active) {
        this.ruleName = ruleName;
        this.route = route;
        this.passengerType = passengerType;
        this.busType = busType;
        this.basePrice = basePrice;
        this.perKmRate = perKmRate;
        this.discountPercentage = discountPercentage;
        this.active = active;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRuleName() { return ruleName; }
    public void setRuleName(String ruleName) { this.ruleName = ruleName; }

    public Route getRoute() { return route; }
    public void setRoute(Route route) { this.route = route; }

    public String getPassengerType() { return passengerType; }
    public void setPassengerType(String passengerType) { this.passengerType = passengerType; }

    public String getBusType() { return busType; }
    public void setBusType(String busType) { this.busType = busType; }

    public double getBasePrice() { return basePrice; }
    public void setBasePrice(double basePrice) { this.basePrice = basePrice; }

    public double getPerKmRate() { return perKmRate; }
    public void setPerKmRate(double perKmRate) { this.perKmRate = perKmRate; }

    public double getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(double discountPercentage) { this.discountPercentage = discountPercentage; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
