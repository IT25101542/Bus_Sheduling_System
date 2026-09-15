package com.lankatransit.system.ticketing;

import com.lankatransit.system.auth.Customer;
import com.lankatransit.system.reservation.Reservation;
import com.lankatransit.system.reservation.Trip;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ticket_number", nullable = false, unique = true, length = 40)
    private String ticketNumber;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reservation_id", nullable = false, unique = true)
    private Reservation reservation;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @Column(name = "passenger_name", nullable = false, length = 120)
    private String passengerName;

    @Column(name = "seat_number", nullable = false, length = 10)
    private String seatNumber;

    @Column(name = "fare_amount", nullable = false)
    private double fareAmount;

    @Column(name = "issue_date")
    private LocalDateTime issueDate = LocalDateTime.now();

    @Column(nullable = false, length = 30)
    private String status = "ISSUED"; // ISSUED, USED, CANCELLED, REFUNDED

    @Column(name = "qr_code")
    private String qrCode;

    public Ticket() {}

    public Ticket(String ticketNumber, Reservation reservation, Trip trip, Customer customer, String passengerName, String seatNumber, double fareAmount, String qrCode) {
        this.ticketNumber = ticketNumber;
        this.reservation = reservation;
        this.trip = trip;
        this.customer = customer;
        this.passengerName = passengerName;
        this.seatNumber = seatNumber;
        this.fareAmount = fareAmount;
        this.qrCode = qrCode;
        this.issueDate = LocalDateTime.now();
        this.status = "ISSUED";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTicketNumber() { return ticketNumber; }
    public void setTicketNumber(String ticketNumber) { this.ticketNumber = ticketNumber; }

    public Reservation getReservation() { return reservation; }
    public void setReservation(Reservation reservation) { this.reservation = reservation; }

    public Trip getTrip() { return trip; }
    public void setTrip(Trip trip) { this.trip = trip; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public String getPassengerName() { return passengerName; }
    public void setPassengerName(String passengerName) { this.passengerName = passengerName; }

    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }

    public double getFareAmount() { return fareAmount; }
    public void setFareAmount(double fareAmount) { this.fareAmount = fareAmount; }

    public LocalDateTime getIssueDate() { return issueDate; }
    public void setIssueDate(LocalDateTime issueDate) { this.issueDate = issueDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getQrCode() { return qrCode; }
    public void setQrCode(String qrCode) { this.qrCode = qrCode; }
}
