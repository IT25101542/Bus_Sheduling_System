package com.lankatransit.system.tripplanning;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "delay_logs")
public class DelayLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "schedule_id", nullable = false)
    private Schedule schedule;

    @Column(name = "delay_minutes", nullable = false)
    private int delayMinutes;

    @Column(name = "delay_reason", nullable = false)
    private String delayReason;

    @Column(name = "updated_departure_time", length = 10)
    private String updatedDepartureTime;

    @Column(name = "reported_by", length = 80)
    private String reportedBy = "Depot Supervisor";

    @Column(name = "reported_at")
    private LocalDateTime reportedAt = LocalDateTime.now();

    public DelayLog() {}

    public DelayLog(Schedule schedule, int delayMinutes, String delayReason, String updatedDepartureTime, String reportedBy) {
        this.schedule = schedule;
        this.delayMinutes = delayMinutes;
        this.delayReason = delayReason;
        this.updatedDepartureTime = updatedDepartureTime;
        this.reportedBy = reportedBy != null ? reportedBy : "Depot Supervisor";
        this.reportedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Schedule getSchedule() { return schedule; }
    public void setSchedule(Schedule schedule) { this.schedule = schedule; }

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
}
