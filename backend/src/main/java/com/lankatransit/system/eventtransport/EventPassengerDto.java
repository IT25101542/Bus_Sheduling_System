package com.lankatransit.system.eventtransport;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class EventPassengerDto {
    private Long id;

    @NotNull(message = "Event ID is required")
    private Long eventId;

    private Long eventTripId;

    @NotBlank(message = "Passenger name is required")
    private String passengerName;

    @NotBlank(message = "Contact phone is required")
    private String contactPhone;

    private String emergencyContact;
    private String seatAllocated;
    private boolean checkInStatus = false;

    private String busNumber;

    public EventPassengerDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }

    public Long getEventTripId() { return eventTripId; }
    public void setEventTripId(Long eventTripId) { this.eventTripId = eventTripId; }

    public String getPassengerName() { return passengerName; }
    public void setPassengerName(String passengerName) { this.passengerName = passengerName; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }

    public String getSeatAllocated() { return seatAllocated; }
    public void setSeatAllocated(String seatAllocated) { this.seatAllocated = seatAllocated; }

    public boolean isCheckInStatus() { return checkInStatus; }
    public void setCheckInStatus(boolean checkInStatus) { this.checkInStatus = checkInStatus; }

    public String getBusNumber() { return busNumber; }
    public void setBusNumber(String busNumber) { this.busNumber = busNumber; }
}
