package com.lankatransit.system.loyalty;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RedeemRequest {

    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @Min(value = 1, message = "Points to redeem must be greater than 0")
    private int points;

    @NotBlank(message = "Reward item name / description is required")
    private String rewardName;

    public RedeemRequest() {}

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public int getPoints() { return points; }
    public void setPoints(int points) { this.points = points; }

    public String getRewardName() { return rewardName; }
    public void setRewardName(String rewardName) { this.rewardName = rewardName; }
}
