package com.lankatransit.system.customerservice;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class SupportRequestDto {
    private Long id;
    private String requestCode;
    private Long customerId;
    private String customerName;

    @NotBlank(message = "Subject is required")
    private String subject;

    private String priority = "MEDIUM"; // LOW, MEDIUM, HIGH, URGENT

    @NotBlank(message = "Description is required")
    private String description;

    private String status = "OPEN";
    private String response;
    private LocalDateTime createdAt;

    public SupportRequestDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRequestCode() { return requestCode; }
    public void setRequestCode(String requestCode) { this.requestCode = requestCode; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
