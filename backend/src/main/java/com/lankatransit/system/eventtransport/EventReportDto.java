package com.lankatransit.system.eventtransport;

public class EventReportDto {
    private Long eventId;
    private String eventName;
    private String eventType;
    private int requiredBuses;
    private int assignedBuses;
    private int requiredCapacity;
    private int totalRegisteredPassengers;
    private int checkedInPassengers;
    private double utilizationRate;
    private String status;

    public EventReportDto() {}

    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }

    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public int getRequiredBuses() { return requiredBuses; }
    public void setRequiredBuses(int requiredBuses) { this.requiredBuses = requiredBuses; }

    public int getAssignedBuses() { return assignedBuses; }
    public void setAssignedBuses(int assignedBuses) { this.assignedBuses = assignedBuses; }

    public int getRequiredCapacity() { return requiredCapacity; }
    public void setRequiredCapacity(int requiredCapacity) { this.requiredCapacity = requiredCapacity; }

    public int getTotalRegisteredPassengers() { return totalRegisteredPassengers; }
    public void setTotalRegisteredPassengers(int totalRegisteredPassengers) { this.totalRegisteredPassengers = totalRegisteredPassengers; }

    public int getCheckedInPassengers() { return checkedInPassengers; }
    public void setCheckedInPassengers(int checkedInPassengers) { this.checkedInPassengers = checkedInPassengers; }

    public double getUtilizationRate() { return utilizationRate; }
    public void setUtilizationRate(double utilizationRate) { this.utilizationRate = utilizationRate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
