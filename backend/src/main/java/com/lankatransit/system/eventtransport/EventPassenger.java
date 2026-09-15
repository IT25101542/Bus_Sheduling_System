package com.lankatransit.system.eventtransport;

import jakarta.persistence.*;

@Entity
@Table(name = "event_passengers")
public class EventPassenger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private TransportEvent event;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "event_trip_id")
    private EventTrip eventTrip;

    @Column(name = "passenger_name", nullable = false, length = 120)
    private String passengerName;

    @Column(name = "contact_phone", nullable = false, length = 20)
    private String contactPhone;

    @Column(name = "emergency_contact", length = 20)
    private String emergencyContact;

    @Column(name = "seat_allocated", length = 10)
    private String seatAllocated;

    @Column(name = "check_in_status")
    private boolean checkInStatus = false;

    public EventPassenger() {}

    public EventPassenger(TransportEvent event, EventTrip eventTrip, String passengerName, String contactPhone, String emergencyContact, String seatAllocated) {
        this.event = event;
        this.eventTrip = eventTrip;
        this.passengerName = passengerName;
        this.contactPhone = contactPhone;
        this.emergencyContact = emergencyContact;
        this.seatAllocated = seatAllocated;
        this.checkInStatus = false;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public TransportEvent getEvent() { return event; }
    public void setEvent(TransportEvent event) { this.event = event; }

    public EventTrip getEventTrip() { return eventTrip; }
    public void setEventTrip(EventTrip eventTrip) { this.eventTrip = eventTrip; }

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
}
