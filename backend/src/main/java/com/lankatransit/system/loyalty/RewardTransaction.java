package com.lankatransit.system.loyalty;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reward_transactions")
public class RewardTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "account_id", nullable = false)
    private RewardAccount account;

    @Column(name = "transaction_type", nullable = false, length = 30)
    private String transactionType; // EARNED, REDEEMED, BONUS, ADJUSTMENT

    @Column(nullable = false)
    private int points;

    @Column(nullable = false, length = 255)
    private String description;

    @Column(name = "transaction_date")
    private LocalDateTime transactionDate = LocalDateTime.now();

    public RewardTransaction() {}

    public RewardTransaction(RewardAccount account, String transactionType, int points, String description) {
        this.account = account;
        this.transactionType = transactionType;
        this.points = points;
        this.description = description;
        this.transactionDate = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public RewardAccount getAccount() { return account; }
    public void setAccount(RewardAccount account) { this.account = account; }

    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    public int getPoints() { return points; }
    public void setPoints(int points) { this.points = points; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDateTime transactionDate) { this.transactionDate = transactionDate; }
}
