package com.lankatransit.system.ticketing;

import com.lankatransit.system.exception.ResourceNotFoundException;
import com.lankatransit.system.reservation.Reservation;
import com.lankatransit.system.reservation.ReservationRepository;
import com.lankatransit.system.tripplanning.Route;
import com.lankatransit.system.tripplanning.RouteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TicketingService {

    private final FareRuleRepository fareRuleRepository;
    private final TicketRepository ticketRepository;
    private final PaymentRepository paymentRepository;
    private final RefundRepository refundRepository;
    private final RouteRepository routeRepository;
    private final ReservationRepository reservationRepository;

    public TicketingService(FareRuleRepository fareRuleRepository,
                            TicketRepository ticketRepository,
                            PaymentRepository paymentRepository,
                            RefundRepository refundRepository,
                            RouteRepository routeRepository,
                            ReservationRepository reservationRepository) {
        this.fareRuleRepository = fareRuleRepository;
        this.ticketRepository = ticketRepository;
        this.paymentRepository = paymentRepository;
        this.refundRepository = refundRepository;
        this.routeRepository = routeRepository;
        this.reservationRepository = reservationRepository;
    }

    // ==========================================
    // FARE RULES CRUD & FARE CALCULATION
    // ==========================================
    public List<FareRuleDto> getAllFareRules() {
        return fareRuleRepository.findAll().stream()
                .map(this::mapToFareRuleDto)
                .collect(Collectors.toList());
    }

    public FareRuleDto getFareRuleById(Long id) {
        FareRule rule = fareRuleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fare rule not found: " + id));
        return mapToFareRuleDto(rule);
    }

    @Transactional
    public FareRuleDto createFareRule(FareRuleDto dto) {
        Route route = null;
        if (dto.getRouteId() != null) {
            route = routeRepository.findById(dto.getRouteId()).orElse(null);
        }
        FareRule rule = new FareRule(
                dto.getRuleName(),
                route,
                dto.getPassengerType(),
                dto.getBusType() != null ? dto.getBusType() : "LUXURY_AC",
                dto.getBasePrice(),
                dto.getPerKmRate(),
                dto.getDiscountPercentage(),
                dto.isActive()
        );
        FareRule saved = fareRuleRepository.save(rule);
        return mapToFareRuleDto(saved);
    }

    @Transactional
    public FareRuleDto updateFareRule(Long id, FareRuleDto dto) {
        FareRule rule = fareRuleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fare rule not found: " + id));

        Route route = null;
        if (dto.getRouteId() != null) {
            route = routeRepository.findById(dto.getRouteId()).orElse(null);
        }
        rule.setRuleName(dto.getRuleName());
        rule.setRoute(route);
        rule.setPassengerType(dto.getPassengerType());
        rule.setBusType(dto.getBusType());
        rule.setBasePrice(dto.getBasePrice());
        rule.setPerKmRate(dto.getPerKmRate());
        rule.setDiscountPercentage(dto.getDiscountPercentage());
        rule.setActive(dto.isActive());

        FareRule updated = fareRuleRepository.save(rule);
        return mapToFareRuleDto(updated);
    }

    @Transactional
    public void deleteFareRule(Long id) {
        FareRule rule = fareRuleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fare rule not found: " + id));
        fareRuleRepository.delete(rule);
    }

    public double calculateFare(Long routeId, String passengerType, String busType) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found: " + routeId));

        // Look for matching rule or fallback to route base fare
        FareRule rule = fareRuleRepository.findByRouteIdAndPassengerType(routeId, passengerType).orElse(null);
        if (rule != null) {
            double calculated = rule.getBasePrice() + (route.getDistanceKm() * rule.getPerKmRate());
            if (rule.getDiscountPercentage() > 0) {
                calculated = calculated * (1.0 - (rule.getDiscountPercentage() / 100.0));
            }
            return Math.round(calculated * 100.0) / 100.0;
        }
        return route.getBaseFare();
    }

    // ==========================================
    // TICKETS CRUD & ISSUANCE
    // ==========================================
    public List<TicketDto> getAllTickets() {
        return ticketRepository.findAll().stream()
                .map(this::mapToTicketDto)
                .collect(Collectors.toList());
    }

    public List<TicketDto> getTicketsByCustomer(Long customerId) {
        return ticketRepository.findByCustomerIdOrderByIssueDateDesc(customerId).stream()
                .map(this::mapToTicketDto)
                .collect(Collectors.toList());
    }

    public TicketDto getTicketById(Long id) {
        Ticket t = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found: " + id));
        return mapToTicketDto(t);
    }

    public TicketDto getTicketByReservation(Long reservationId) {
        Ticket t = ticketRepository.findByReservationId(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found for reservation: " + reservationId));
        return mapToTicketDto(t);
    }

    @Transactional
    public TicketDto issueTicket(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found: " + reservationId));

        Ticket existing = ticketRepository.findByReservationId(reservationId).orElse(null);
        if (existing != null) {
            return mapToTicketDto(existing);
        }

        String ticketNumber = "TKT-2026-" + (1000 + (int)(Math.random() * 8999));
        String qrCode = "LT_QR_" + reservation.getBookingReference() + "_" + reservation.getSeatNumber();

        Ticket ticket = new Ticket(
                ticketNumber,
                reservation,
                reservation.getTrip(),
                reservation.getCustomer(),
                reservation.getPassengerName(),
                reservation.getSeatNumber(),
                reservation.getTotalAmount(),
                qrCode
        );
        Ticket saved = ticketRepository.save(ticket);
        return mapToTicketDto(saved);
    }

    @Transactional
    public void cancelTicket(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found: " + id));
        ticket.setStatus("CANCELLED");
        ticketRepository.save(ticket);
    }

    // ==========================================
    // PAYMENTS CRUD
    // ==========================================
    public List<PaymentDto> getAllPayments() {
        return paymentRepository.findAllByOrderByPaymentDateDesc().stream()
                .map(this::mapToPaymentDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public PaymentDto processPayment(PaymentDto dto) {
        Reservation reservation = reservationRepository.findById(dto.getReservationId())
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found: " + dto.getReservationId()));

        Ticket ticket = ticketRepository.findByReservationId(reservation.getId())
                .orElseGet(() -> {
                    String ticketNumber = "TKT-2026-" + (1000 + (int)(Math.random() * 8999));
                    String qrCode = "LT_QR_" + reservation.getBookingReference() + "_" + reservation.getSeatNumber();
                    return ticketRepository.save(new Ticket(
                            ticketNumber,
                            reservation,
                            reservation.getTrip(),
                            reservation.getCustomer(),
                            reservation.getPassengerName(),
                            reservation.getSeatNumber(),
                            reservation.getTotalAmount(),
                            qrCode
                    ));
                });

        String txnRef = "TXN-" + System.currentTimeMillis() + "-" + (100 + (int)(Math.random() * 899));
        String receiptNo = "RCPT-2026-" + (1000 + (int)(Math.random() * 8999));

        Payment payment = new Payment(
                txnRef,
                reservation,
                ticket,
                dto.getAmount() > 0 ? dto.getAmount() : reservation.getTotalAmount(),
                dto.getPaymentMethod() != null ? dto.getPaymentMethod() : "CREDIT_CARD",
                "COMPLETED",
                receiptNo
        );
        Payment saved = paymentRepository.save(payment);
        return mapToPaymentDto(saved);
    }

    // ==========================================
    // REFUNDS CRUD
    // ==========================================
    public List<RefundDto> getAllRefunds() {
        return refundRepository.findAllByOrderByProcessedAtDesc().stream()
                .map(this::mapToRefundDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public RefundDto processRefund(RefundDto dto) {
        Ticket ticket = ticketRepository.findById(dto.getTicketId())
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found: " + dto.getTicketId()));

        String refundRef = "RFD-" + System.currentTimeMillis();
        double refundAmount = dto.getRefundAmount() > 0 ? dto.getRefundAmount() : (ticket.getFareAmount() * 0.90); // 10% processing fee

        Refund refund = new Refund(
                refundRef,
                ticket,
                ticket.getReservation(),
                refundAmount,
                dto.getReason(),
                "PROCESSED"
        );
        Refund saved = refundRepository.save(refund);

        ticket.setStatus("REFUNDED");
        ticketRepository.save(ticket);

        return mapToRefundDto(saved);
    }

    // ==========================================
    // REPORTS SUMMARY
    // ==========================================
    public Map<String, Object> getFinancialReport() {
        List<Payment> payments = paymentRepository.findAll();
        List<Refund> refunds = refundRepository.findAll();

        double totalRevenue = payments.stream().mapToDouble(Payment::getAmount).sum();
        double totalRefunded = refunds.stream().mapToDouble(Refund::getRefundAmount).sum();
        double netRevenue = totalRevenue - totalRefunded;

        Map<String, Object> report = new HashMap<>();
        report.put("totalTicketsIssued", ticketRepository.count());
        report.put("totalTransactions", payments.size());
        report.put("totalRevenue", totalRevenue);
        report.put("totalRefundsProcessed", refunds.size());
        report.put("totalRefundAmount", totalRefunded);
        report.put("netRevenue", netRevenue);
        return report;
    }

    // Mapping helpers
    private FareRuleDto mapToFareRuleDto(FareRule r) {
        FareRuleDto dto = new FareRuleDto();
        dto.setId(r.getId());
        dto.setRuleName(r.getRuleName());
        dto.setRouteId(r.getRoute() != null ? r.getRoute().getId() : null);
        dto.setRouteName(r.getRoute() != null ? r.getRoute().getRouteNumber() + " (" + r.getRoute().getOrigin() + " - " + r.getRoute().getDestination() + ")" : "All Routes");
        dto.setPassengerType(r.getPassengerType());
        dto.setBusType(r.getBusType());
        dto.setBasePrice(r.getBasePrice());
        dto.setPerKmRate(r.getPerKmRate());
        dto.setDiscountPercentage(r.getDiscountPercentage());
        dto.setActive(r.isActive());
        return dto;
    }

    private TicketDto mapToTicketDto(Ticket t) {
        TicketDto dto = new TicketDto();
        dto.setId(t.getId());
        dto.setTicketNumber(t.getTicketNumber());
        dto.setReservationId(t.getReservation().getId());
        dto.setBookingReference(t.getReservation().getBookingReference());
        dto.setTripId(t.getTrip().getId());
        dto.setTripCode(t.getTrip().getTripCode());
        dto.setTripDate(t.getTrip().getTripDate());
        dto.setDepartureTime(t.getTrip().getDepartureTime());
        dto.setArrivalTime(t.getTrip().getArrivalTime());
        dto.setRouteName(t.getTrip().getRoute().getOrigin() + " -> " + t.getTrip().getRoute().getDestination());
        dto.setBusNumber(t.getTrip().getBus().getBusNumber());
        dto.setCustomerId(t.getCustomer() != null ? t.getCustomer().getId() : null);
        dto.setPassengerName(t.getPassengerName());
        dto.setSeatNumber(t.getSeatNumber());
        dto.setFareAmount(t.getFareAmount());
        dto.setIssueDate(t.getIssueDate());
        dto.setStatus(t.getStatus());
        dto.setQrCode(t.getQrCode());
        return dto;
    }

    private PaymentDto mapToPaymentDto(Payment p) {
        PaymentDto dto = new PaymentDto();
        dto.setId(p.getId());
        dto.setTransactionRef(p.getTransactionRef());
        dto.setReservationId(p.getReservation().getId());
        dto.setTicketId(p.getTicket() != null ? p.getTicket().getId() : null);
        dto.setAmount(p.getAmount());
        dto.setPaymentMethod(p.getPaymentMethod());
        dto.setPaymentStatus(p.getPaymentStatus());
        dto.setPaymentDate(p.getPaymentDate());
        dto.setReceiptNumber(p.getReceiptNumber());
        dto.setPassengerName(p.getReservation().getPassengerName());
        dto.setBookingReference(p.getReservation().getBookingReference());
        return dto;
    }

    private RefundDto mapToRefundDto(Refund r) {
        RefundDto dto = new RefundDto();
        dto.setId(r.getId());
        dto.setRefundRef(r.getRefundRef());
        dto.setTicketId(r.getTicket().getId());
        dto.setReservationId(r.getReservation().getId());
        dto.setRefundAmount(r.getRefundAmount());
        dto.setReason(r.getReason());
        dto.setStatus(r.getStatus());
        dto.setProcessedAt(r.getProcessedAt());
        dto.setTicketNumber(r.getTicket().getTicketNumber());
        dto.setPassengerName(r.getReservation().getPassengerName());
        return dto;
    }
}
