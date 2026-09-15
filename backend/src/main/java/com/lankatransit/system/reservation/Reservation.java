package com.lankatransit.system.reservation;

import com.lankatransit.system.auth.Customer;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_reference", nullable = false, unique = true, length = 40)
    private String bookingReference;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @Column(name = "passenger_name", nullable = false, length = 120)
    private String passengerName;

    @Column(name = "passenger_phone", nullable = false, length = 20)
    private String passengerPhone;

    @Column(name = "passenger_nic", length = 20)
    private String passengerNic;

    @Column(name = "seat_number", nullable = false, length = 10)
    private String seatNumber;

    @Column(name = "total_amount", nullable = false)
    private double totalAmount;

    @Column(name = "reservation_status", nullable = false, length = 30)
    private String reservationStatus = "CONFIRMED"; // CONFIRMED, CANCELLED, MODIFIED

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Reservation() {}

    public Reservation(String bookingReference, Trip trip, Customer customer, String passengerName, String passengerPhone, String passengerNic, String seatNumber, double totalAmount) {
        this.bookingReference = bookingReference;
        this.trip = trip;
        this.customer = customer;
        this.passengerName = passengerName;
        this.passengerPhone = passengerPhone;
        this.passengerNic = passengerNic;
        this.seatNumber = seatNumber;
        this.totalAmount = totalAmount;
        this.reservationStatus = "CONFIRMED";
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBookingReference() { return bookingReference; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }

    public Trip getTrip() { return trip; }
    public void setTrip(Trip trip) { this.trip = trip; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public String getPassengerName() { return passengerName; }
    public void setPassengerName(String passengerName) { this.passengerName = passengerName; }

    public String getPassengerPhone() { return passengerPhone; }
    public void setPassengerPhone(String passengerPhone) { this.passengerPhone = passengerPhone; }

    public String getPassengerNic() { return passengerNic; }
    public void setPassengerNic(String passengerNic) { this.passengerNic = passengerNic; }

    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public String getReservationStatus() { return reservationStatus; }
    public void setReservationStatus(String reservationStatus) { this.reservationStatus = reservationStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
