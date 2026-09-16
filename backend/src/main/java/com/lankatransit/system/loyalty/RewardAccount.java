package com.lankatransit.system.loyalty;

import com.lankatransit.system.auth.Customer;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reward_accounts")
public class RewardAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", nullable = false, unique = true)
    private Customer customer;

    @Column(name = "current_points", nullable = false)
    private int currentPoints = 0;

    @Column(name = "total_earned", nullable = false)
    private int totalEarned = 0;

    @Column(name = "total_redeemed", nullable = false)
    private int totalRedeemed = 0;

    @Column(name = "tier_level", nullable = false, length = 30)
    private String tierLevel = "BRONZE"; // BRONZE, SILVER, GOLD, PLATINUM

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public RewardAccount() {}

    public RewardAccount(Customer customer, int currentPoints, int totalEarned, int totalRedeemed, String tierLevel) {
        this.customer = customer;
        this.currentPoints = currentPoints;
        this.totalEarned = totalEarned;
        this.totalRedeemed = totalRedeemed;
        this.tierLevel = tierLevel != null ? tierLevel : "BRONZE";
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

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

    public void updateTier() {
        if (this.totalEarned >= 2500) {
            this.tierLevel = "PLATINUM";
        } else if (this.totalEarned >= 1000) {
            this.tierLevel = "GOLD";
        } else if (this.totalEarned >= 500) {
            this.tierLevel = "SILVER";
        } else {
            this.tierLevel = "BRONZE";
        }
    }
}
