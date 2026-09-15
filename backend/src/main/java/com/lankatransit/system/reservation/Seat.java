package com.lankatransit.system.reservation;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "seats", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"trip_id", "seat_number"})
})
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    @JsonIgnore
    private Trip trip;

    @Column(name = "seat_number", nullable = false, length = 10)
    private String seatNumber;

    @Column(name = "seat_status", nullable = false, length = 20)
    private String seatStatus = "AVAILABLE"; // AVAILABLE, BOOKED, RESERVED

    @Column(name = "passenger_name", length = 120)
    private String passengerName;

    @Column(name = "passenger_gender", length = 10)
    private String passengerGender;

    public Seat() {}

    public Seat(Trip trip, String seatNumber, String seatStatus) {
        this.trip = trip;
        this.seatNumber = seatNumber;
        this.seatStatus = seatStatus != null ? seatStatus : "AVAILABLE";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Trip getTrip() { return trip; }
    public void setTrip(Trip trip) { this.trip = trip; }

    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }

    public String getSeatStatus() { return seatStatus; }
    public void setSeatStatus(String seatStatus) { this.seatStatus = seatStatus; }

    public String getPassengerName() { return passengerName; }
    public void setPassengerName(String passengerName) { this.passengerName = passengerName; }

    public String getPassengerGender() { return passengerGender; }
    public void setPassengerGender(String passengerGender) { this.passengerGender = passengerGender; }
}
