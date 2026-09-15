package com.lankatransit.system.ticketing;

import com.lankatransit.system.reservation.Reservation;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "refunds")
public class Refund {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "refund_ref", nullable = false, unique = true, length = 50)
    private String refundRef;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @Column(name = "refund_amount", nullable = false)
    private double refundAmount;

    @Column(nullable = false)
    private String reason;

    @Column(nullable = false, length = 30)
    private String status = "PROCESSED"; // PENDING, PROCESSED, REJECTED

    @Column(name = "processed_at")
    private LocalDateTime processedAt = LocalDateTime.now();

    public Refund() {}

    public Refund(String refundRef, Ticket ticket, Reservation reservation, double refundAmount, String reason, String status) {
        this.refundRef = refundRef;
        this.ticket = ticket;
        this.reservation = reservation;
        this.refundAmount = refundAmount;
        this.reason = reason;
        this.status = status != null ? status : "PROCESSED";
        this.processedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRefundRef() { return refundRef; }
    public void setRefundRef(String refundRef) { this.refundRef = refundRef; }

    public Ticket getTicket() { return ticket; }
    public void setTicket(Ticket ticket) { this.ticket = ticket; }

    public Reservation getReservation() { return reservation; }
    public void setReservation(Reservation reservation) { this.reservation = reservation; }

    public double getRefundAmount() { return refundAmount; }
    public void setRefundAmount(double refundAmount) { this.refundAmount = refundAmount; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getProcessedAt() { return processedAt; }
    public void setProcessedAt(LocalDateTime processedAt) { this.processedAt = processedAt; }
}
