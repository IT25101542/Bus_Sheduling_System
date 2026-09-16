package com.lankatransit.system.loyalty;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reward_programs")
public class RewardProgram {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "program_name", nullable = false, length = 80)
    private String programName;

    @Column(name = "min_points", nullable = false)
    private int minPoints = 100;

    @Column(name = "point_multiplier", nullable = false)
    private double pointMultiplier = 1.0;

    @Column(name = "discount_percentage", nullable = false)
    private double discountPercentage = 5.0;

    @Column(length = 255)
    private String description;

    @Column(name = "is_active")
    private boolean active = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public RewardProgram() {}

    public RewardProgram(String programName, int minPoints, double pointMultiplier, double discountPercentage, String description, boolean active) {
        this.programName = programName;
        this.minPoints = minPoints;
        this.pointMultiplier = pointMultiplier;
        this.discountPercentage = discountPercentage;
        this.description = description;
        this.active = active;
        this.createdAt = LocalDateTime.now();
    }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
