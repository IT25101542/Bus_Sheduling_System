package com.lankatransit.system.loyalty;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class RewardProgramDto {
    private Long id;

    @NotBlank(message = "Program name is required")
    private String programName;

    @Min(value = 0, message = "Minimum points cannot be negative")
    private int minPoints = 100;

    @Min(value = 0, message = "Point multiplier cannot be negative")
    private double pointMultiplier = 1.0;

    @Min(value = 0, message = "Discount percentage cannot be negative")
    private double discountPercentage = 5.0;

    private String description;
    private boolean active = true;

    public RewardProgramDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProgramName() { return programName; }
    public void setProgramName(String programName) { this.programName = programName; }

    public int getMinPoints() { return minPoints; }
    public void setMinPoints(int minPoints) { this.minPoints = minPoints; }

    public double getPointMultiplier() { return pointMultiplier; }
    public void setPointMultiplier(double pointMultiplier) { this.pointMultiplier = pointMultiplier; }

    public double getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(double discountPercentage) { this.discountPercentage = discountPercentage; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
