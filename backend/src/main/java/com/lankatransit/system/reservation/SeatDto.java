package com.lankatransit.system.reservation;

public class SeatDto {
    private Long id;
    private String seatNumber;
    private String seatStatus; // AVAILABLE, BOOKED, RESERVED
    private String passengerName;

    public SeatDto() {}

    public SeatDto(Long id, String seatNumber, String seatStatus, String passengerName) {
        this.id = id;
        this.seatNumber = seatNumber;
        this.seatStatus = seatStatus;
        this.passengerName = passengerName;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }

    public String getSeatStatus() { return seatStatus; }
    public void setSeatStatus(String seatStatus) { this.seatStatus = seatStatus; }

    public String getPassengerName() { return passengerName; }
    public void setPassengerName(String passengerName) { this.passengerName = passengerName; }
}
