package com.lankatransit.system.loyalty;

import java.time.LocalDateTime;

public class RewardTransactionDto {
    private Long id;
    private Long accountId;
    private Long customerId;
    private String customerName;
    private String transactionType;
    private int points;
    private String description;
    private LocalDateTime transactionDate;

    public RewardTransactionDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getAccountId() { return accountId; }
    public void setAccountId(Long accountId) { this.accountId = accountId; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    public int getPoints() { return points; }
    public void setPoints(int points) { this.points = points; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDateTime transactionDate) { this.transactionDate = transactionDate; }
}
