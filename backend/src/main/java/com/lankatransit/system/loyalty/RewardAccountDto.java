package com.lankatransit.system.loyalty;

import java.time.LocalDateTime;

public class RewardAccountDto {
    private Long id;
    private Long customerId;
    private String customerName;
    private int currentPoints;
    private int totalEarned;
    private int totalRedeemed;
    private String tierLevel;
    private LocalDateTime updatedAt;

    public RewardAccountDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public int getCurrentPoints() { return currentPoints; }
    public void setCurrentPoints(int currentPoints) { this.currentPoints = currentPoints; }

    public int getTotalEarned() { return totalEarned; }
    public void setTotalEarned(int totalEarned) { this.totalEarned = totalEarned; }

    public int getTotalRedeemed() { return totalRedeemed; }
    public void setTotalRedeemed(int totalRedeemed) { this.totalRedeemed = totalRedeemed; }

    public String getTierLevel() { return tierLevel; }
    public void setTierLevel(String tierLevel) { this.tierLevel = tierLevel; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
