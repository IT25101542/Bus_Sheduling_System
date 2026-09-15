package com.lankatransit.system.customerservice;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class ComplaintDto {
    private Long id;
    private String complaintCode;
    private Long customerId;
    private String customerName;

    @NotBlank(message = "Category is required")
    private String category; // BUS_CONDITION, DRIVER_CONDUCT, SCHEDULE_DELAY, FARE_ISSUE, LOST_PROPERTY

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Description is required")
    private String description;

    private String tripReference;
    private String status = "OPEN"; // OPEN, IN_PROGRESS, RESOLVED, CLOSED
    private String resolutionNotes;
    private LocalDateTime submittedAt;
    private LocalDateTime resolvedAt;

    public ComplaintDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getComplaintCode() { return complaintCode; }
    public void setComplaintCode(String complaintCode) { this.complaintCode = complaintCode; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTripReference() { return tripReference; }
    public void setTripReference(String tripReference) { this.tripReference = tripReference; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
}
