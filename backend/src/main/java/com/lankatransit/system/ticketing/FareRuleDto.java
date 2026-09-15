package com.lankatransit.system.ticketing;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class FareRuleDto {
    private Long id;

    @NotBlank(message = "Rule name is required")
    private String ruleName;

    private Long routeId;
    private String routeName;

    @NotBlank(message = "Passenger type is required")
    private String passengerType = "ADULT"; // ADULT, CHILD, STUDENT, SENIOR

    private String busType = "LUXURY_AC";

    @Min(value = 0, message = "Base price cannot be negative")
    private double basePrice;

    @Min(value = 0, message = "Per km rate cannot be negative")
    private double perKmRate;

    private double discountPercentage = 0.0;
    private boolean active = true;

    public FareRuleDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRuleName() { return ruleName; }
    public void setRuleName(String ruleName) { this.ruleName = ruleName; }

    public Long getRouteId() { return routeId; }
    public void setRouteId(Long routeId) { this.routeId = routeId; }

    public String getRouteName() { return routeName; }
    public void setRouteName(String routeName) { this.routeName = routeName; }

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
