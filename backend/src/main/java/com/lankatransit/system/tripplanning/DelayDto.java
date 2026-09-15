package com.lankatransit.system.tripplanning;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class DelayDto {
    private Long id;

    @NotNull(message = "Schedule ID is required")
    private Long scheduleId;

    @Min(value = 1, message = "Delay minutes must be greater than 0")
    private int delayMinutes;

    @NotBlank(message = "Delay reason is required")
    private String delayReason;

    private String updatedDepartureTime;
    private String reportedBy = "Depot Supervisor";
    private LocalDateTime reportedAt;

    private String scheduleCode;
    private String routeName;

    public DelayDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getScheduleId() { return scheduleId; }
    public void setScheduleId(Long scheduleId) { this.scheduleId = scheduleId; }

    public int getDelayMinutes() { return delayMinutes; }
    public void setDelayMinutes(int delayMinutes) { this.delayMinutes = delayMinutes; }

    public String getDelayReason() { return delayReason; }
    public void setDelayReason(String delayReason) { this.delayReason = delayReason; }

    public String getUpdatedDepartureTime() { return updatedDepartureTime; }
    public void setUpdatedDepartureTime(String updatedDepartureTime) { this.updatedDepartureTime = updatedDepartureTime; }

    public String getReportedBy() { return reportedBy; }
    public void setReportedBy(String reportedBy) { this.reportedBy = reportedBy; }

    public LocalDateTime getReportedAt() { return reportedAt; }
    public void setReportedAt(LocalDateTime reportedAt) { this.reportedAt = reportedAt; }

    public String getScheduleCode() { return scheduleCode; }
    public void setScheduleCode(String scheduleCode) { this.scheduleCode = scheduleCode; }

    public String getRouteName() { return routeName; }
    public void setRouteName(String routeName) { this.routeName = routeName; }
}
